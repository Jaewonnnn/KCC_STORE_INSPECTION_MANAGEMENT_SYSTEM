$(document).on('click', '.checklistPreviewBtn', function() {
    console.log('checklistPreviewBtn clicked');
    const checklistName = $(this).closest('li').find('.item-info p').text();
    console.log(checklistName);

    fetch(`/master/checklist/detail/${checklistName}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            checklistCtgBtn(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// modal-header에 대분류 버튼 생성
function checklistCtgBtn(preview) {
    $('.large-category-group').empty();

    for (const category in preview.data) {
        if (preview.data.hasOwnProperty(category)) {
            $('.large-category-group').append(`
                <button type="button" class="btn btn-primary category-btn" data-category="${category}">${category}</button>
            `);
        }
    }

    // 기존 이벤트 제거 후 첫 번째 대분류 버튼 선택하여 중분류 생성
    $('.category-btn').off('click').on('click', function() {
        const selectedCategory = $(this).data('category');
        checklistSubCtg(preview.data, selectedCategory);
    });

    const firstCategory = Object.keys(preview.data)[0];
    checklistSubCtg(preview.data, firstCategory);
}

// modal-body에 중분류 accordion 생성
function checklistSubCtg(subCategory, category) {
    const subCategoryData = subCategory[category];
    $('.modal-body .row').empty(); // Clear previous content

    for (const subCategoryItem in subCategoryData) {
        if (subCategoryData.hasOwnProperty(subCategoryItem)) {
            const uniqueID = `outerCollapse${category}_${subCategoryItem.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim, '')}`;

            $('.modal-body .category').append(`
                <div class="col mb-3">
                    <div class="accordion" id="accordionExample${uniqueID}">
                        <div class="accordion-item inner-accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button inner-accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${uniqueID}" aria-expanded="false" aria-controls="${uniqueID}">
                                    ${subCategoryItem}
                                </button>
                            </h2>
                            <div id="${uniqueID}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample${uniqueID}">
                                <div class="accordion-body" style = "padding: 0rem;">
                                    <div class="accordion" id="innerAccordion${uniqueID}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            // inner accordion 콘텐츠 생성
            checklistEvit(subCategoryData[subCategoryItem], uniqueID);
        }
    }
}

function checklistEvit(subCategoryData, uniqueID) {
    const innerAccordionID = `innerAccordion${uniqueID}`;
    let innerAccordionHTML = '';

    for (const category in subCategoryData) {
        if (subCategoryData.hasOwnProperty(category)) {
            const items = subCategoryData[category];
            const innerCollapseID = `${innerAccordionID}${category.replace(/[^a-zA-Z0-9]/g, '')}`;

            innerAccordionHTML += `
                <div class="accordion-item inner-accordion-item border-0">
                    <h2 class="accordion-header" id="innerHeading${category}">
                        <button class="accordion-button inner-accordion-button collapsed border-0" style="background-color: white !important;" type="button">
                            ${category}
                        </button>
                    </h2>
            `;
            innerAccordionHTML += `
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // 기존 내용을 지우고 새로운 내용을 추가
    $(`#${innerAccordionID}`).html(innerAccordionHTML);
}
