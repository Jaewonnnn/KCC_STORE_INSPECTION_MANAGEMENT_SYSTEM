// 전역 변수로 inspectionAllScheduleData 선언
let inspectionAllScheduleData = [];

// 점검 유형 코드 매핑 객체 추가
const INSPECTION_TYPE_MAP = {
    'IT001': '제품점검',
    'IT002': '위생점검',
    'IT003': '정기점검',
    'IT004': '비정기점검',
    'IT005': '기획점검'
};

// DOMContentLoaded 이벤트 리스너
document.addEventListener('DOMContentLoaded', function () {
    fetchInspectionData()
        .then(data => {
            inspectionAllScheduleData = transformData(data);

            console.log(inspectionAllScheduleData);
            populateInspectorSelect();
            calender();
        })
        .catch(error => {
            console.error('데이터 가져오기 실패:', error);
            alert('점검 데이터를 불러오는 데 실패했습니다.');
        });
});

// REST Controller에서 데이터 가져오기
function fetchInspectionData() {
    return fetch('/filter/store_inspection')
        .then(response => {
            if (!response.ok) {
                throw new Error(`네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`);
            }
            return response.json();
        });
}

// 데이터 변환 함수
function transformData(data) {
    const transformedData = [];

    data.forEach(item => {
        // 기존 항목에서 필요한 필드 추출
        const mbrId = item.mbrId || item.INSP_MBR_ID;
        const mbrNm = item.mbrNm || item.INSP_MBR_NAME;
        const mbrNo = item.mbrNo || item.INSP_MBR_NO;
        const chklstNmFull = item.chklstNm;
        const storeNm = item.storeNm;
        const inspPlanDtRaw = item.inspPlanDt;
        const inspSttsCd = item.inspSttsCd;
        const chklstId = item.chklstId;
        const inspResultId = item.inspResultId;
        const inspTypeCd = item.inspTypeCd || item.INSP_TYPE_CD;

        // CTG_NM 추출 (chklstNm의 첫 네 글자)
        const CTG_NM = chklstNmFull.slice(0, 4); // 예: "위생점검체크리스트" -> "위생점검"

        // CHKLST_NM 생성 (storeNm + ' ' + chklstNm의 첫 네 글자)
        const CHKLST_NM = `${storeNm} ${CTG_NM}`; // 예: "홍대점 위생점검"

        // INSP_PLAN_DT 변환 "20241110" -> "2024/11/10"
        const inspPlanDt = `${inspPlanDtRaw.substring(0, 4)}/${inspPlanDtRaw.substring(4,6)}/${inspPlanDtRaw.substring(6,8)}`;

        // 기존 mbrId가 transformedData에 있는지 확인
        let inspector = transformedData.find(ins => ins.INSP_MBR_ID === mbrId);

        if (!inspector) {
            inspector = {
                INSP_MBR_ID: mbrId,
                INSP_MBR_NAME: mbrNm,
                INSP_MBR_NO: mbrNo,
                INSP_TYPE: []
            };
            transformedData.push(inspector);
            console.log(`Added new inspector: ${mbrNm}`);
        }

        // CTG_NM이 inspector의 INSP_TYPE에 있는지 확인
        let category = inspector.INSP_TYPE.find(cat => cat.CTG_NM === CTG_NM);

        if (!category) {
            category = {
                CTG_NM: CTG_NM,
                SUB_CTH_NM: []
            };
            inspector.INSP_TYPE.push(category);
            console.log(`Added new category: ${CTG_NM} to inspector: ${mbrNm}`);
        }

        // 점검 항목
        category.SUB_CTH_NM.push({
            STORE_NM: storeNm,
            CHKLST_NM: CHKLST_NM,
            FULL_CHKLST_NM: chklstNmFull,
            INSP_PLAN_DT: inspPlanDt,
            INSP_STTS_CD: inspSttsCd,
            CHKLST_ID: chklstId,
            INSP_RESULT_ID: inspResultId,
            inspTypeCd: inspTypeCd
        });
        console.log(`Added checklist: ${CHKLST_NM} on ${inspPlanDt} with status ${inspSttsCd}`);
    });

    console.log('Transformed Data:', transformedData);
    return transformedData;
}



//점검자 필터링
function populateInspectorSelect() {
    const inspMbrSelect = document.getElementById('insp-mbr');
    inspMbrSelect.innerHTML = ''; // 기존 옵션 초기화

    // 기본값 추가 (예: "전체" 또는 "점검자 선택")
    const defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = '전체';
    inspMbrSelect.appendChild(defaultOption);

    // INSP_MBR_NAME들을 드롭다운에 추가
    inspectionAllScheduleData.forEach(inspector => {
        const option = document.createElement('option');
        option.value = inspector.INSP_MBR_ID; // 또는 inspector.INSP_MBR_NAME 사용 가능
        option.textContent = inspector.INSP_MBR_NAME;
        inspMbrSelect.appendChild(option);
    });

    // 사용자 역할에 따라 선택된 옵션 설정
    if (currentUserRole === 'INSPECTOR') {
        // INSPECTOR인 경우 자신의 INSP_MBR_ID를 선택
        const inspector = inspectionAllScheduleData.find(ins => ins.INSP_MBR_NO === currentUsername);
        if (inspector) {
            inspMbrSelect.value = inspector.INSP_MBR_ID;
            console.log(`INSPECTOR found: ${inspector.INSP_MBR_NAME} (ID: ${inspector.INSP_MBR_ID})`);
        } else {
            // 해당 INSP_MBR_NO를 가진 Inspector가 없으면 "전체" 선택
            inspMbrSelect.value = 'all';
            console.warn(`No INSPECTOR found with mbrNo: ${currentUsername}. Defaulting to 'all'.`);
        }
    } else {
        // INSPECTOR가 아닌 경우 "전체" 선택
        inspMbrSelect.value = 'all';
        console.log("User is not INSPECTOR. Defaulting insp-mbr select to 'all'.");
    }

    console.log('insp-mbr select value set to:', inspMbrSelect.value);
}

function getSelectedInspector() {
    const inspMbrSelect = document.getElementById('insp-mbr');
    return inspMbrSelect.value; // 'all' 또는 INSP_MBR_ID 반환
}


function calender() {
    const calendarBody = document.getElementById('calendar-body');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const checklistSelect = document.getElementById('checklist-select');
    let selectedDate = null;


    const today = new Date(); // 오늘 날짜 객체 생성
    const defaultYear = today.getFullYear(); // 오늘의 년도
    const defaultMonth = today.getMonth(); // 오늘의 월 (0부터 시작)
    let defaultDay = new Date().getDate(); // 전역 변수로 이동

    // 년도 드롭다운 생성 함수
    function populateYearSelect(startYear = 1900, endYear = 2100, defaultYear) {
        yearSelect.innerHTML = ''; // 기존 옵션 제거
        for (let year = startYear; year <= endYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year}년`;
            if (year === defaultYear) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        }
    }

    // 월 드롭다운 생성 함수
    function populateMonthSelect(defaultMonth) {
        const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
        monthSelect.innerHTML = '';
        months.forEach((monthName, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = monthName;
            if (index === defaultMonth) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        });
    }

    // 달력 생성 함수
    function generateCalendar(month, year) {
        calendarBody.innerHTML = ''; // 기존 달력 내용 초기화

        const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 첫 번째 날의 요일 (0: 일요일)
        const lastDate = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜

        let day = 1;
        let row;

        // 총 주 수 계산 (첫 주 + 마지막 주의 빈 칸을 고려)
        const totalDays = firstDay + lastDate;
        const totalWeeks = Math.ceil(totalDays / 7);

        for (let week = 0; week < totalWeeks; week++) {
            row = document.createElement('tr');

            for (let i = 0; i < 7; i++) {
                const currentDayIndex = week * 7 + i;
                const cell = document.createElement('td');

                if (currentDayIndex >= firstDay && day <= lastDate) {
                    const dayContent = createCalendarCell(day++, year, month, i); // 요일 인덱스 전달
                    cell.appendChild(dayContent);
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }

        // 초기 로드시 오늘 날짜의 점검 목록과 스케줄 테이블 생성
        const selectedDay = selectedDate ? parseInt(selectedDate.textContent) : defaultDay;
        const date = new Date(year, month, selectedDay);
        generateTodayInspectionList(date);
        generateScheduleTable(date);
    }

    // 날짜 선택 함수
    function createCalendarCell(day, year, month, dayOfWeek) { // dayOfWeek 인자 추가
        const dayContent = document.createElement('div');
        dayContent.classList.add('day-content');
        dayContent.textContent = day;

        // 요일에 따라 클래스 추가
        if (dayOfWeek === 0) { // 일요일
            dayContent.classList.add('sunday');
        } else if (dayOfWeek === 6) { // 토요일
            dayContent.classList.add('saturday');
        }

        // 오늘 날짜 자동 선택
        if (year === defaultYear && month === defaultMonth && day === defaultDay) {
            dayContent.classList.add('selected'); // selected 클래스 추가
            selectedDate = dayContent;
        }

        // 현재 날짜를 "YYYY/MM/DD" 형식으로 변환
        const currentDate = new Date(year, month, day);
        const dateStr = formatDate(currentDate);

        // 오늘 날짜 객체 생성 (시간 부분을 제거하여 날짜만 비교)
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        // 선택된 점검자 가져오기
        const selectedInspector = getSelectedInspector();

        // 해당 날짜가 오늘 이전인지 확인
        const isPastDate = currentDate < todayDate;

        // 해당 날짜에 미완료된 점검이 있는지 확인
        let hasIncompleteInspection = false;

        if (isPastDate) {
            inspectionAllScheduleData.forEach(inspector => {
                // 선택된 점검자에 따라 필터링 ('all'인 경우 모두 포함)
                if (selectedInspector === 'all' || selectedInspector == inspector.INSP_MBR_ID) {
                    inspector.INSP_TYPE.forEach(category => {
                        category.SUB_CTH_NM.forEach(item => {
                            if (item.INSP_PLAN_DT === dateStr && item.INSP_STTS_CD === 'IS001') {
                                hasIncompleteInspection = true;
                            }
                        });
                    });
                }
            });
        }

        // 미완료된 점검이 있는 경우 'incomplete' 클래스 추가
        if (hasIncompleteInspection) {
            dayContent.classList.add('incomplete');
        }

        // 클릭 이벤트 추가
        dayContent.addEventListener('click', function () {
            if (selectedDate) {
                selectedDate.classList.remove('selected'); // 이전 선택 제거
            }
            selectedDate = dayContent; // 새로 선택된 요소로 갱신
            dayContent.classList.add('selected'); // 선택된 날짜 표시

            const selectedYear = parseInt(yearSelect.value);
            const selectedMonth = parseInt(monthSelect.value);
            const selectedDay = parseInt(dayContent.textContent);
            const date = new Date(selectedYear, selectedMonth, selectedDay);

            generateTodayInspectionList(date); // 점검 목록 생성
            generateScheduleTable(date); // 스케줄 테이블 생성
        });

        return dayContent;
    }




    // 년도 및 월 선택 시 달력 갱신
    function updateCalendar() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        generateCalendar(selectedMonth, selectedYear);
    }

    // 페이지 로드 시 초기 설정
    populateYearSelect(2024, 2100, defaultYear); // 년도 드롭다운 생성
    populateMonthSelect(defaultMonth); // 월 드롭다운 생성
    updateCalendar(); // 초기 달력 생성

    // 월 또는 년도 변경 시 달력 갱신
    monthSelect.addEventListener('change', updateCalendar);
    yearSelect.addEventListener('change', updateCalendar);

    // 체크리스트 선택 변경 시 스케줄 테이블 갱신
    document.getElementById('insp-mbr').addEventListener('change', function() {
        const selectedYear = parseInt(document.getElementById('year-select').value);
        const selectedMonth = parseInt(document.getElementById('month-select').value);
        const selectedDay = selectedDate ? parseInt(selectedDate.textContent) : defaultDay;
        const date = new Date(selectedYear, selectedMonth, selectedDay);

        // 달력 업데이트
        generateCalendar(selectedMonth, selectedYear);
        // 오늘의 점검 목록 업데이트
        generateTodayInspectionList(date);
        // 스케줄 테이블 업데이트
        generateScheduleTable(date);
    });

    checklistSelect.addEventListener('change', function() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);
        const selectedDay = selectedDate ? parseInt(selectedDate.textContent) : defaultDay;
        const date = new Date(selectedYear, selectedMonth, selectedDay);
        generateTodayInspectionList(date); // 필요에 따라 추가
        generateScheduleTable(date);
    });

}

// 좌측상단 오늘의 점검표시 함수
function generateTodayInspectionList(date) {
    const listContainer = document.getElementById('today_inspection_list');
    listContainer.innerHTML = '';

    const dateStr = formatDate(date); // "YYYY/MM/DD" 형식으로 변환
    let hasInspection = false; // 점검 여부를 추적하는 변수

    const selectedInspector = getSelectedInspector();
    const MAX_VISIBLE_ITEMS = 5; // 처음에 보여줄 최대 항목 수
    let itemCount = 0; // 생성된 항목 수를 추적
    let hiddenItems = []; // 숨겨진 항목들을 저장할 배열

    inspectionAllScheduleData.forEach(inspector => {
        // 선택된 점검자에 따라 필터링 ('all'인 경우 모두 포함)
        if (selectedInspector === 'all' || selectedInspector == inspector.INSP_MBR_ID) {
            inspector.INSP_TYPE.forEach(category => {
                category.SUB_CTH_NM.forEach(item => {
                    if (item.INSP_PLAN_DT === dateStr) {
                        hasInspection = true;
                        const li = document.createElement('li');
                        const h4 = document.createElement('h4');

                        // 수정된 부분: INSP_TYPE_CD 대신 inspTypeCd 사용
                        h4.textContent = INSPECTION_TYPE_MAP[item.inspTypeCd] || '알 수 없는 점검 유형';

                        const pTitle = document.createElement('p');
                        pTitle.classList.add('today_inspection_list_title');
                        pTitle.textContent = item.STORE_NM;
                        const pDate = document.createElement('p');
                        pDate.classList.add('today_inspection_list_date');
                        pDate.textContent = item.INSP_PLAN_DT.replace(/\//g, '.');
                        li.appendChild(h4);
                        li.appendChild(pTitle);
                        li.appendChild(pDate);

                        // 항목 개수에 따라 처리
                        if (itemCount < MAX_VISIBLE_ITEMS) {
                            listContainer.appendChild(li);
                        } else {
                            li.style.display = 'none'; // 처음엔 숨김 처리
                            hiddenItems.push(li); // 숨겨진 항목에 추가
                        }
                        itemCount++;
                    }
                });
            });
        }
    });

    // 5개 이상일 때 "+n개 더보기" div 생성
    if (hiddenItems.length > 0) {
        const moreLi = document.createElement('li');
        const moreP = document.createElement('p');
        moreP.classList.add('today_inspection_list_title');
        moreP.textContent = `+${hiddenItems.length}개 더보기`;
        moreP.style.cursor = 'pointer';

        // 스타일을 직접 적용
        moreLi.style.display = 'flex';
        moreLi.style.justifyContent = 'center';
        moreLi.style.alignItems = 'center';
        moreLi.style.padding = '0';

        moreP.addEventListener('click', () => {
            hiddenItems.forEach(item => (item.style.display = '')); // 숨겨진 항목 표시
            moreLi.style.display = 'none'; // 더보기 항목 숨기기
        });

        moreLi.appendChild(moreP);
        listContainer.appendChild(moreLi);
    }

    // 점검이 없는 경우 "점검이 없습니다." 메시지 표시
    if (!hasInspection) {
        const noInspectionMsg = document.createElement('li');
        const pTag = document.createElement('p');
        pTag.textContent = '점검이 없습니다.';
        pTag.classList.add('no-inspection-message');
        noInspectionMsg.appendChild(pTag);
        listContainer.appendChild(noInspectionMsg);
    }
}


// 점검 한주 스케줄 표시 함수
// function generateScheduleTable(date) {
//     const tableBody = document.getElementById('schedule-table-body');
//     tableBody.innerHTML = '';
//
//     // Tooltip div 생성 (한 번만 생성)
//     let tooltip = document.getElementById('tooltip-div');
//     if (!tooltip) {
//         tooltip = document.createElement('div');
//         tooltip.id = 'tooltip-div';
//         tooltip.classList.add('tooltip-div'); // CSS에서 스타일링할 클래스 추가
//         document.body.appendChild(tooltip);
//     }
//
//     // 선택한 날짜의 주 (일요일 시작)
//     const weekStartDate = new Date(date);
//     weekStartDate.setDate(date.getDate() - date.getDay()); // 일요일로 설정
//
//     const selectedChecklist = document.getElementById('checklist-select').value;
//     const selectedInspector = getSelectedInspector();
//
//     const weekRow = document.createElement('tr');
//     for (let i = 0; i < 7; i++) {
//         const cellDate = new Date(weekStartDate);
//         cellDate.setDate(weekStartDate.getDate() + i);
//
//         const td = document.createElement('td');
//         const spanDate = document.createElement('span');
//         spanDate.textContent = `${cellDate.getMonth() + 1}/${cellDate.getDate()}`;
//
//         // 버튼과 날짜를 감쌀 div 생성
//         const btnDateWrap = document.createElement('div');
//         btnDateWrap.classList.add('btn-date-wrap');
//
//         // 일요일(0)과 토요일(6)에 empty-cell 클래스 추가
//         if (i === 0 || i === 6) {
//             td.classList.add('empty-cell');
//         }
//
//         // 해당 날짜의 점검 항목 가져오기
//         const dateStr = formatDate(cellDate);
//
//         let allItems = [];
//         inspectionAllScheduleData.forEach(inspector => {
//             // 선택된 점검자에 따라 필터링 ('all'인 경우 모두 포함)
//             if (selectedInspector === 'all' || selectedInspector == inspector.INSP_MBR_ID) {
//                 inspector.INSP_TYPE.forEach(category => {
//                     category.SUB_CTH_NM.forEach(item => {
//                         // 체크리스트 필터링: 'all' 또는 선택한 유형과 일치
//                         if (selectedChecklist === 'all' || INSPECTION_TYPE_MAP[item.inspTypeCd] === selectedChecklist) {
//                             if (item.INSP_PLAN_DT === dateStr) {
//                                 allItems.push({
//                                     categoryName: INSPECTION_TYPE_MAP[item.inspTypeCd] || '알 수 없는 점검 유형',
//                                     itemName: item.CHKLST_NM, // 전체 체크리스트 이름 사용
//                                     fullChklstNm: item.FULL_CHKLST_NM, // 전체 체크리스트 이름 추가
//                                     planDate: item.INSP_PLAN_DT,
//                                     statusCode: item.INSP_STTS_CD, // 상태 코드 추가
//                                     chklstId: item.CHKLST_ID, // chklstId 추가
//                                     storeNm: extractStoreName(item.CHKLST_NM), // storeNm 추출 함수 사용
//                                     inspResultId: item.INSP_RESULT_ID,
//                                     inspTypeCd: item.inspTypeCd // INSP_TYPE_CD 추가
//                                 });
//                             }
//                         }
//                     });
//                 });
//             }
//         });
//
//         // 미완료된 점검 항목을 먼저 오도록 정렬
//         allItems.sort((a, b) => {
//             const today = new Date();
//             today.setHours(0,0,0,0);
//
//             const dateA = new Date(a.planDate.replace(/\//g, '-'));
//             const dateB = new Date(b.planDate.replace(/\//g, '-'));
//             dateA.setHours(0,0,0,0);
//             dateB.setHours(0,0,0,0);
//
//             const isIncompleteA = dateA < today && a.statusCode === 'IS001' ? 1 : 0;
//             const isIncompleteB = dateB < today && b.statusCode === 'IS001' ? 1 : 0;
//
//             return isIncompleteB - isIncompleteA; // isIncomplete가 높은 것부터 정렬
//         });
//
//         // 버튼들을 td에 추가하기 전에 btn-date-wrap에 추가
//         if (allItems.length > 3) {
//             const extraCount = allItems.length - 3;
//             const moreButton = document.createElement('button');
//             moreButton.classList.add('more-btn');
//             moreButton.textContent = `+${extraCount} 더보기`;
//
//             // '+n 더보기' 버튼 클릭 시 모달 창 열기
//             moreButton.addEventListener('click', function() {
//                 openModal(allItems);
//             });
//
//             // btn-date-wrap에 more-btn과 spanDate 추가
//             btnDateWrap.appendChild(moreButton);
//             btnDateWrap.appendChild(spanDate);
//             td.appendChild(btnDateWrap);
//         } else {
//             // 더보기 버튼이 없을 경우 날짜만 추가
//             const spanWrapper = document.createElement('div');
//             spanWrapper.classList.add('btn-date-wrap');
//             spanWrapper.appendChild(spanDate);
//             td.appendChild(spanWrapper);
//         }
//
//         // 실제로 표시할 버튼들 (최대 3개)
//         const displayItems = allItems.slice(0, 3);
//         displayItems.forEach(item => {
//             const button = document.createElement('button');
//             button.classList.add('inspection-btn');
//
//             // INSP_TYPE_CD에 따른 점검 유형 이름과 가맹점명 결합
//             const inspTypeName = INSPECTION_TYPE_MAP[item.inspTypeCd] || '알 수 없는 점검 유형';
//             button.textContent = `${item.storeNm} ${inspTypeName}`;
//
//             // 점검 상태에 따라 팝업 함수 설정
//             if (item.statusCode === 'IS002') {
//                 // 완료된 점검인 경우 openPopup2 호출
//                 button.onclick = function() {
//                     openPopup2(item.inspResultId);
//                 };
//             } else {
//                 // 미완료된 점검인 경우 openPopup 호출
//                 button.onclick = function() {
//                     openPopup(item);
//                 };
//             }
//
//             // 아이템의 날짜과 상태를 확인하여 스타일 적용
//             const itemDate = new Date(item.planDate.replace(/\//g, '-'));
//             const todayDate = new Date();
//             todayDate.setHours(0,0,0,0); // 오늘 날짜의 시간을 0시로 설정
//             itemDate.setHours(0,0,0,0); // 아이템 날짜의 시간을 0시로 설정
//
//             if (itemDate < todayDate) {
//                 if (item.statusCode === 'IS001') {
//                     // 미완료된 이전 날짜의 점검인 경우 배경색 변경
//                     button.style.backgroundColor = '#EC3B57';
//                     button.style.color = 'white';
//                 } else if (item.statusCode === 'IS002') {
//                     // 완료된 이전 날짜의 점검인 경우 배경색 변경
//                     button.style.backgroundColor = '#eeeeee';
//                 }
//             }
//
//             // Tooltip 표시를 위한 이벤트 리스너 추가
//             button.addEventListener('mouseenter', function(e) {
//                 tooltip.textContent = `체크리스트명: ${item.fullChklstNm}`; // FULL_CHKLST_NM 필드 사용
//                 tooltip.style.display = 'block';
//             });
//
//             button.addEventListener('mousemove', function(e) {
//                 // Tooltip을 마우스 커서 옆에 위치시키기
//                 tooltip.style.left = (e.pageX + 10) + 'px';
//                 tooltip.style.top = (e.pageY + 10) + 'px';
//             });
//
//             button.addEventListener('mouseleave', function(e) {
//                 tooltip.style.display = 'none';
//             });
//
//             td.appendChild(button);
//         });
//
//         // 버튼이 3개 이상일 경우 '+n 더보기' 버튼은 이미 추가됨
//
//         weekRow.appendChild(td);
//     }
//
//     tableBody.appendChild(weekRow);
// }
function generateScheduleTable(date) {
    const tableBody = document.getElementById('schedule-table-body');
    tableBody.innerHTML = '';

    // Tooltip div 생성 (한 번만 생성)
    let tooltip = document.getElementById('tooltip-div');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip-div';
        tooltip.classList.add('tooltip-div'); // CSS에서 스타일링할 클래스 추가
        document.body.appendChild(tooltip);
    }

    // 선택한 날짜의 주 (일요일 시작)
    const weekStartDate = new Date(date);
    weekStartDate.setDate(date.getDate() - date.getDay()); // 일요일로 설정

    const selectedChecklist = document.getElementById('checklist-select').value;
    const selectedInspector = getSelectedInspector();

    const weekRow = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
        const cellDate = new Date(weekStartDate);
        cellDate.setDate(weekStartDate.getDate() + i);

        const td = document.createElement('td');
        const spanDate = document.createElement('span');
        spanDate.textContent = `${cellDate.getMonth() + 1}/${cellDate.getDate()}`;

        // 버튼과 날짜를 감쌀 div 생성
        const btnDateWrap = document.createElement('div');
        btnDateWrap.classList.add('btn-date-wrap');

        // 일요일(0)과 토요일(6)에 empty-cell 클래스 추가
        if (i === 0 || i === 6) {
            td.classList.add('empty-cell');
        }

        // 해당 날짜의 점검 항목 가져오기
        const dateStr = formatDate(cellDate);

        let allItems = [];
        inspectionAllScheduleData.forEach(inspector => {
            // 선택된 점검자에 따라 필터링 ('all'인 경우 모두 포함)
            if (selectedInspector === 'all' || selectedInspector == inspector.INSP_MBR_ID) {
                inspector.INSP_TYPE.forEach(category => {
                    category.SUB_CTH_NM.forEach(item => {
                        // 체크리스트 필터링: 'all' 또는 선택한 유형과 일치
                        if (selectedChecklist === 'all' || INSPECTION_TYPE_MAP[item.inspTypeCd] === selectedChecklist) {
                            if (item.INSP_PLAN_DT === dateStr) {
                                allItems.push({
                                    categoryName: INSPECTION_TYPE_MAP[item.inspTypeCd] || '알 수 없는 점검 유형',
                                    itemName: item.CHKLST_NM, // 전체 체크리스트 이름 사용
                                    fullChklstNm: item.FULL_CHKLST_NM, // 전체 체크리스트 이름 추가
                                    planDate: item.INSP_PLAN_DT,
                                    statusCode: item.INSP_STTS_CD, // 상태 코드 추가
                                    chklstId: item.CHKLST_ID, // chklstId 추가
                                    storeNm: extractStoreName(item.CHKLST_NM), // storeNm 추출 함수 사용
                                    inspResultId: item.INSP_RESULT_ID,
                                    inspTypeCd: item.inspTypeCd // INSP_TYPE_CD 추가
                                });
                            }
                        }
                    });
                });
            }
        });

        // 미완료된 점검 항목을 먼저 오도록 정렬
        allItems.sort((a, b) => {
            const today = new Date();
            today.setHours(0,0,0,0);

            const dateA = new Date(a.planDate.replace(/\//g, '-'));
            const dateB = new Date(b.planDate.replace(/\//g, '-'));
            dateA.setHours(0,0,0,0);
            dateB.setHours(0,0,0,0);

            const isIncompleteA = dateA < today && a.statusCode === 'IS001' ? 1 : 0;
            const isIncompleteB = dateB < today && b.statusCode === 'IS001' ? 1 : 0;

            return isIncompleteB - isIncompleteA; // isIncomplete가 높은 것부터 정렬
        });

        // 버튼들을 td에 추가하기 전에 btn-date-wrap에 추가
        if (allItems.length > 3) {
            const extraCount = allItems.length - 3;
            const moreButton = document.createElement('button');
            moreButton.classList.add('more-btn');
            moreButton.textContent = `+${extraCount} 더보기`;

            // '+n 더보기' 버튼 클릭 시 모달 창 열기
            moreButton.addEventListener('click', function() {
                openModal(allItems);
            });

            // btn-date-wrap에 more-btn과 spanDate 추가
            btnDateWrap.appendChild(moreButton);
            btnDateWrap.appendChild(spanDate);
            td.appendChild(btnDateWrap);
        } else {
            // 더보기 버튼이 없을 경우 날짜만 추가
            const spanWrapper = document.createElement('div');
            spanWrapper.classList.add('btn-date-wrap');
            spanWrapper.appendChild(spanDate);
            td.appendChild(spanWrapper);
        }

        // 실제로 표시할 버튼들 (최대 3개)
        const displayItems = allItems.slice(0, 3);
        displayItems.forEach(item => {
            const button = document.createElement('button');
            button.classList.add('inspection-btn');

            // INSP_TYPE_CD에 따른 점검 유형 이름과 가맹점명 결합
            const inspTypeName = INSPECTION_TYPE_MAP[item.inspTypeCd] || '알 수 없는 점검 유형';
            button.textContent = `${item.storeNm} ${inspTypeName}`;

            // 점검 상태에 따라 팝업 함수 설정
            if (item.statusCode === 'IS002') {
                // 완료된 점검인 경우 openPopup2 호출
                button.onclick = function() {
                    openPopup2(item.inspResultId);
                };
            } else {
                // 미완료된 점검인 경우 openPopup 호출
                button.onclick = function() {
                    openPopup(item);
                };
            }

            // 아이템의 날짜과 상태를 확인하여 스타일 적용
            const itemDate = new Date(item.planDate.replace(/\//g, '-'));
            const todayDate = new Date();
            todayDate.setHours(0,0,0,0); // 오늘 날짜의 시간을 0시로 설정
            itemDate.setHours(0,0,0,0); // 아이템 날짜의 시간을 0시로 설정

            // 오늘 이전의 날짜인 경우
            if (itemDate < todayDate) {
                if (item.statusCode === 'IS001') {
                    // 미완료된 이전 날짜의 점검인 경우 배경색 변경 (빨간색)
                    button.style.backgroundColor = '#EC3B57';
                    button.style.color = 'white';
                } else if (item.statusCode === 'IS002') {
                    // 완료된 이전 날짜의 점검인 경우 배경색 변경 (회색)
                    button.style.backgroundColor = '#eeeeee';
                }
            }
            // 오늘 날짜인 경우
            else if (itemDate.getTime() === todayDate.getTime()) {
                if (item.statusCode === 'IS002') {
                    // 완료된 오늘 날짜의 점검인 경우 배경색 변경 (회색)
                    button.style.backgroundColor = '#eeeeee';
                }
                // 미완료된 오늘 날짜의 점검은 스타일 적용하지 않음
            }

            // Tooltip 표시를 위한 이벤트 리스너 추가
            button.addEventListener('mouseenter', function(e) {
                tooltip.textContent = `체크리스트명: ${item.fullChklstNm}`; // FULL_CHKLST_NM 필드 사용
                tooltip.style.display = 'block';
            });

            button.addEventListener('mousemove', function(e) {
                // Tooltip을 마우스 커서 옆에 위치시키기
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
            });

            button.addEventListener('mouseleave', function(e) {
                tooltip.style.display = 'none';
            });

            td.appendChild(button);
        });

        // 버튼이 3개 이상일 경우 '+n 더보기' 버튼은 이미 추가됨

        weekRow.appendChild(td);
    }

    tableBody.appendChild(weekRow);
}







// storeNm 추출 함수 예시 (CHKLST_NM에서 storeNm을 추출하는 방법에 따라 수정 필요)
function extractStoreName(chklstNmFull) {
    // 예를 들어, "홍대점 위생점검"에서 "홍대점"을 추출
    const parts = chklstNmFull.split(' ');
    return parts.length > 0 ? parts[0] : '';
}






function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0'+(date.getMonth()+1)).slice(-2);
    const day = ('0'+date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
}


// 모달 창 열기 함수
function openModal(items) {
    // 미완료된 점검 항목을 먼저 오도록 정렬
    items.sort((a, b) => {
        const today = new Date();
        today.setHours(0,0,0,0);

        const dateA = new Date(a.planDate.replace(/\//g, '-'));
        const dateB = new Date(b.planDate.replace(/\//g, '-'));
        dateA.setHours(0,0,0,0);
        dateB.setHours(0,0,0,0);

        const isIncompleteA = dateA < today && a.statusCode === 'IS001' ? 1 : 0;
        const isIncompleteB = dateB < today && b.statusCode === 'IS001' ? 1 : 0;

        return isIncompleteB - isIncompleteA;
    });

    // 모달 배경 요소 생성
    let modalBackground = document.getElementById('modal-background');
    if (!modalBackground) {
        modalBackground = document.createElement('div');
        modalBackground.id = 'modal-background';
        modalBackground.classList.add('modal-background');
        document.body.appendChild(modalBackground);
    }

    // 모달 내용 요소 생성
    let modalContent = document.getElementById('modal-content');
    if (!modalContent) {
        modalContent = document.createElement('div');
        modalContent.id = 'modal-content';
        modalContent.classList.add('modal-content');
        modalBackground.appendChild(modalContent);
    }

    // 모달 내용 초기화
    modalContent.innerHTML = '<h2>점검 목록</h2>';

    // Tooltip div 재사용
    let tooltip = document.getElementById('tooltip-div');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip-div';
        tooltip.classList.add('tooltip-div'); // CSS에서 스타일링할 클래스 추가
        document.body.appendChild(tooltip);
    }

    // 아이템들을 모달에 추가
    items.forEach(function(item) {
        const button = document.createElement('button');
        button.classList.add('inspection-btn');

        // INSP_TYPE_CD에 따른 점검 유형 이름과 가맹점명 결합
        const inspTypeName = INSPECTION_TYPE_MAP[item.inspTypeCd] || '알 수 없는 점검 유형';
        button.textContent = `${item.storeNm} ${inspTypeName}`;

        // 점검 상태에 따라 팝업 함수 설정
        if (item.statusCode === 'IS002') {
            // 완료된 점검인 경우 openPopup2 호출
            button.onclick = function() {
                openPopup2(item.inspResultId);
            };
        } else {
            // 미완료된 점검인 경우 openPopup 호출
            button.onclick = function() {
                openPopup(item);
            };
        }

        // 아이템의 날짜과 상태를 확인하여 스타일 적용
        const itemDate = new Date(item.planDate.replace(/\//g, '-'));
        const todayDate = new Date();
        todayDate.setHours(0,0,0,0); // 오늘 날짜의 시간을 0시로 설정
        itemDate.setHours(0,0,0,0); // 아이템 날짜의 시간을 0시로 설정

        if (itemDate < todayDate) {
            if (item.statusCode === 'IS001') {
                // 미완료된 이전 날짜의 점검인 경우 배경색 변경
                button.style.backgroundColor = '#EC3B57';
                button.style.color = 'white';
            } else if (item.statusCode === 'IS002') {
                // 완료된 이전 날짜의 점검인 경우 배경색 변경
                button.style.backgroundColor = '#eeeeee';
            }
        }

        // Tooltip 표시를 위한 이벤트 리스너 추가
        button.addEventListener('mouseenter', function(e) {
            tooltip.textContent = `체크리스트명: ${item.fullChklstNm}`; // FULL_CHKLST_NM 필드 사용
            tooltip.style.display = 'block';
        });

        button.addEventListener('mousemove', function(e) {
            // Tooltip을 마우스 커서 옆에 위치시키기
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY + 10) + 'px';
        });

        button.addEventListener('mouseleave', function(e) {
            tooltip.style.display = 'none';
        });

        modalContent.appendChild(button);
    });

    // 모달 닫기 버튼 추가
    const closeButton = document.createElement('button');
    closeButton.textContent = '닫기';
    closeButton.classList.add('modal-close-btn');
    closeButton.addEventListener('click', function() {
        // 'show' 클래스 제거하여 애니메이션 시작
        modalBackground.classList.remove('show');
        modalContent.classList.remove('show');
        // 애니메이션 후 display:none 처리
        setTimeout(function() {
            modalBackground.style.display = 'none';
        }, 300); // transition 시간과 동일하게 설정
    });
    modalContent.appendChild(closeButton);

    // 모달 표시 (display:flex 설정 후 약간의 지연을 주어 애니메이션 적용)
    modalBackground.style.display = 'flex';
    setTimeout(function() {
        modalBackground.classList.add('show');
        modalContent.classList.add('show');
    }, 10);
}

//---------------------지도토글함수------------------
initializeMapToggle();

function initializeMapToggle() {
    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.querySelector('.map-section .toggle-button');
        const mapSection = document.querySelector('.map-section');

        if (!toggleButton || !mapSection) {
            console.warn('Toggle button or map section not found.');
            return;
        }

        // 모든 map-view-button 요소 선택
        const mapButtons = document.querySelectorAll('.map-view-button');

        mapButtons.forEach(button => {
            // 버튼의 data-tooltip 속성을 설정하여 커스텀 툴팁 사용
            const tooltipText = button.getAttribute('data-tooltip') || button.textContent.trim();
            if (tooltipText) {
                button.setAttribute('data-tooltip', tooltipText);
            }

            // 버튼 내부의 아이콘에 pointer-events: none 적용
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.pointerEvents = 'none';
            }
        });

        // Function to replace text with icons and vice versa
        function swapButtonContent() {
            if (window.innerWidth <= 600) {
                mapButtons.forEach(button => {
                    if (!button.dataset.originalText) {
                        button.dataset.originalText = button.textContent.trim();
                    }
                    if (!button.querySelector('i')) {
                        const iconClass = button.id === 'map-all' ? 'fa-solid fa-map-location-dot' : 'fa-solid fa-road';
                        const icon = document.createElement('i');
                        icon.className = iconClass;
                        icon.style.pointerEvents = 'none'; // 아이콘이 마우스 이벤트를 차단하지 않도록 설정
                        button.textContent = ''; // 기존 텍스트 제거
                        button.appendChild(icon);
                    }
                });
            } else {
                mapButtons.forEach(button => {
                    if (button.dataset.originalText) {
                        button.textContent = button.dataset.originalText;
                        const icon = button.querySelector('i');
                        if (icon) {
                            button.removeChild(icon);
                        }
                    }
                });
            }
        }

        // 초기 상태 설정: 화면 너비에 따라 버튼 내용 변경 및 토글 버튼 아이콘 설정
        function setInitialState() {
            if (window.innerWidth <= 600) {
                // localStorage에 저장된 상태 확인
                const isCollapsed = localStorage.getItem('mapCollapsed') === 'true';
                if (isCollapsed) {
                    if (!mapSection.classList.contains('collapsed')) {
                        mapSection.classList.add('collapsed');
                        const toggleIcon = toggleButton.querySelector('i');
                        if (toggleIcon) {
                            toggleIcon.classList.replace('fa-times', 'fa-bars'); // Show 'fa-bars' when collapsed
                        }
                    }
                } else {
                    if (mapSection.classList.contains('collapsed')) {
                        mapSection.classList.remove('collapsed');
                        const toggleIcon = toggleButton.querySelector('i');
                        if (toggleIcon) {
                            toggleIcon.classList.replace('fa-bars', 'fa-times'); // Show 'fa-times' when expanded
                        }
                    }
                }
            } else {
                // 화면 너비가 600px 초과일 때는 항상 펼쳐진 상태
                if (mapSection.classList.contains('collapsed')) {
                    mapSection.classList.remove('collapsed');
                    const toggleIcon = toggleButton.querySelector('i');
                    if (toggleIcon) {
                        toggleIcon.classList.replace('fa-times', 'fa-bars'); // Show 'fa-bars'
                    }
                }
            }

            // Swap button content based on screen size
            swapButtonContent();
        }

        setInitialState(); // 초기 상태 설정

        // 창 크기 변경 시 초기 상태 재설정 및 button content 변경
        window.addEventListener('resize', function() {
            setInitialState();
            swapButtonContent();
        });

        toggleButton.addEventListener('click', function() {
            mapSection.classList.toggle('collapsed');

            const icon = toggleButton.querySelector('i');
            if (!icon) {
                console.warn('Icon element not found within toggle button.');
                return;
            }

            if (mapSection.classList.contains('collapsed')) {
                // 접힌 상태일 때: 열기 아이콘으로 변경 (fa-bars)
                icon.classList.replace('fa-times', 'fa-bars');
                localStorage.setItem('mapCollapsed', 'true');
            } else {
                // 펼쳐진 상태일 때: 닫기 아이콘으로 변경 (fa-times)
                icon.classList.replace('fa-bars', 'fa-times');
                localStorage.setItem('mapCollapsed', 'false');
            }
        });
    });
}






//---------------------팝업 이동 함수------------------------
// 팝업 이동 함수
function openPopup(item) {

    if (item.statusCode === 'IS001') {
        const itemDate = new Date(item.planDate.replace(/\//g, '-'));
        const today = new Date();
        today.setHours(0,0,0,0); // 오늘 날짜의 시간을 0시로 설정
        itemDate.setHours(0,0,0,0); // 아이템 날짜의 시간을 0시로 설정

        if (itemDate > today) {
            // 오늘 이후의 날짜인 경우 경고 메시지 표시하고 함수 종료
            Swal.fire({
                title: '점검 날짜가 아닙니다.',
                text: '해당 점검은 지정된 날짜에만 진행할 수 있습니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return; // 팝업을 열지 않고 함수 종료
        }
    }

    // 팝업 페이지 URL 설정 (컨트롤러 매핑과 일치)
    const popupUrl = `/qsc/popup-page?chklstId=${item.chklstId}&storeNm=${encodeURIComponent(item.storeNm)}&inspPlanDt=${item.planDate.replace(/\//g, '')}`;

    // 현재 화면 크기 확인
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

    // 모바일 디바이스 확인 (가로 크기가 768px 이하인 경우)
    const isMobile = screenWidth <= 768;

    // 팝업 창 크기 설정 (화면의 80% 크기 또는 전체 크기)
    const popupWidth = isMobile ? screenWidth : screenWidth * 0.8;  // 모바일: 100%, 데스크탑: 80%
    const popupHeight = isMobile ? screenHeight : screenHeight * 0.9;  // 모바일: 100%, 데스크탑: 90%

    // 팝업 창의 중앙 위치 계산 (모바일은 무시)
    const screenLeft = window.screenLeft || window.screenX;
    const screenTop = window.screenTop || window.screenY;
    const left = isMobile ? 0 : screenLeft + (screenWidth - popupWidth) / 2;
    const top = isMobile ? 0 : screenTop + (screenHeight - popupHeight) / 2;

    // 팝업 창 옵션 (위치 및 크기 포함)
    const popupOptions = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`;

    // 새 창을 팝업으로 엽니다
    window.open(popupUrl, '_blank', popupOptions);
}

// 점검완료페이지
function openPopup2(inspResultId) {
    // 팝업 페이지 URL 설정
    const popupUrl = "/qsc/popup/inspection/result"; // 팝업 페이지로 보낼 URL 설정

    // 현재 화면 크기 확인
    const screenWidth =
        window.innerWidth || document.documentElement.clientWidth || screen.width;
    const screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        screen.height;

    // 모바일 디바이스 확인 (가로 크기가 768px 이하인 경우)
    const isMobile = screenWidth <= 768;

    // 팝업 창 크기 설정 (화면의 90% 크기 또는 전체 크기)
    const popupWidth = isMobile ? screenWidth : screenWidth * 0.8;
    const popupHeight = isMobile ? screenHeight : screenHeight;

    // 팝업 창의 중앙 위치 계산 (모바일은 무시)
    const screenLeft = window.screenLeft || window.screenX;
    const screenTop = window.screenTop || window.screenY;
    const left = isMobile ? 0 : screenLeft + (screenWidth - popupWidth) / 2;
    const top = isMobile ? 0 : screenTop + (screenHeight - popupHeight) / 2;

    // 팝업 창 옵션 (위치 및 크기 포함)
    const popupOptions = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`;

    // 팝업 창을 열기
    const popupWindow = window.open("", "_blank", popupOptions);

    // 팝업 창이 열렸는지 확인 후 폼을 팝업 창에서 제출
    if (popupWindow) {
        // 팝업 창에 form을 작성하여 POST 방식으로 데이터를 전송
        const form = popupWindow.document.createElement("form");
        form.method = "POST";
        form.action = popupUrl; // 팝업 창에서 처리할 URL


        // 필요한 데이터를 form에 추가 (필요에 따라 수정 가능)
        const input = popupWindow.document.createElement("input");
        input.type = "hidden";
        input.name = "inspectionContent";
        input.value = inspResultId; // inspResultId는 팝업으로 전송할 데이터

        form.appendChild(input);

        // form을 팝업창에 추가 후 제출
        popupWindow.document.body.appendChild(form);
        form.submit();
    } else {
        alert("팝업 차단이 발생했습니다. 팝업을 허용해 주세요.");
    }
}