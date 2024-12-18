<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIMS</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
            rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==' crossorigin='anonymous'/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css" rel="stylesheet">

    <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_inspection.css">
    <link rel="stylesheet" href="/resources/css/qsc/inspection_result/popup_inspection_result.css">
    <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- html2pdf.js 라이브러리 추가 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
</head>
<body>
<%--<p>입력된 기타사항: ${textareaData}</p>--%>
<section class="inspection-detail">
    <div class="inspection-info">
        <table class="inspection-table">
            <tr>
                <td class="info-title">
                    <p></p>
                </td>
                <td class="info-details">
                    <span class="store-name"></span>
                    <span class="store-subtitle"></span>
                    <span class="inspection-date"></span>
                    <span class="inspector-name"></span>
                </td>
            </tr>
        </table>
    </div>
</section>
<section class="inspection-section">
    <div class="inspection-tabs">
        <button class="inspection-tab active" data-tab="report-summary">보고서 간략</button>
        <button class="inspection-tab" data-tab="detailed-result">세부결과</button>
        <div class="d-flex align-items-center justify-content-end" style="height: 100%;">
            부적합 사항만 보기
            <input type="checkbox" id="checkboxInput">
            <label for="checkboxInput" class="toggleSwitch ms-2">
            </label>
        </div>
    </div>

    <%--  ----------------탭에 따라서 변하는 구역----------------  --%>
    <div class="tab-content report-summary">
        <div class="score-section">
            <table class="score-table">
                <thead>
                <tr>
                    <th>총점</th>
                    <th>적합 수</th>
                    <th>부적합 수</th>
                    <th>문항 수</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>

            <div class="grade-section">
                <div class="grade-box">
                    <p>등급</p>
                    <p class="grade-text"><span></span> 등급</p>
                </div>
                <div class="total-score-box">
                    <p>백점환산</p>
                    <p class="total-score-text"><span></span> 점</p>
                </div>
            </div>
        </div>

        <div class="admin-action-section">
            <p class="admin-title">행정처분</p>
            <div class="admin-box">
                <div class="fine-box-wrapper">
                    <p>과태료</p>
                    <div class="fine-box">
                        <p class="fine-amount"><span></span> 만원</p>
                    </div>
                </div>
                <div class="closure-box-wrapper">
                    <p>영업정지</p>
                    <div class="closure-box">
                        <p class="closure-days"><span></span> 일</p>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- 세부결과 구역 -->
    <div class="tab-content detailed-result" style="display: none;">
        <div class="detailed-section">
            <!-- JavaScript로 동적으로 상세 항목들이 생성됩니다 -->
        </div>
    </div>





    <%--  ----------------탭에 따라서 변하는 구역----------------  --%>


    <div class="inspection-total-score">
        <p>총 <span></span> 점</p>
    </div>
</section>

<div id="go-inspection-wrap">
    <button class="go-inspection" onclick="outInspectionResult()">나가기</button>
    <button class="print-button btn btn-secondary ms-2" onclick="fn_printClick()">다운로드</button>
</div>

<%--  ----------------하단 세부결과 보기----------------  --%>

<section id="inspection-result-list" style="display: none;">
    <h2 class="item-title"></h2>
    <div class="check-item">
        <!-- 동적으로 생성되는 내용 -->
    </div>
</section>




</body>
<script src="/resources/js/qsc/inspection_result/popup_inspection_result.js"></script>
<input type="hidden" value="${content}"/>
</html>
