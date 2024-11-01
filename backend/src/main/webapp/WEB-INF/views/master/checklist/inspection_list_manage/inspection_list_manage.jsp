<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SIMS</title>
  <!-- Bootstrap CSS -->
  <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
  />
  <!-- Font Awesome -->
  <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
          rel="stylesheet"
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
  />
  <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
  />
  <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossorigin="anonymous"
  />
  <!-- Iconscout Link For Icons -->
  <link
          rel="stylesheet"
          href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
  />
  <link
          rel="stylesheet"
          href="/resources/css/master/checklist/inspection_list_manage/inspection_list_manage.css"
  />
  <!-- SweetAlert2 CSS -->
  <link
          href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
          rel="stylesheet"
  />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/ag-grid-community/dist/ag-grid-community.min.js"></script>
  <!-- SweetAlert2 JS -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


</head>
<body>
  <div class="sidebar">
    <jsp:include page="../../../sidebar/sidebar.jsp" />
  </div>
  <div class="page-wrapper2">
    <main class="page-content">
      <div class="container content">
        <%-- top box start--%>
        <div class="row top-box">
          <div class="col">
            <div class="top-content">
              <div class="button-box" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="d-flex justify-content-start">
                  <p class="m-3" style="font: 700 20px Noto Sans KR; margin: 0 !important;">점검 항목 관리</p>
                  <div class="top-drop-down">
                    <button>
                      <i class="fa-solid fa-angle-right"></i>
                    </button>
                  </div>
                </div>
                <div class="my-3" style="margin: 0 !important;">
                  <button type="button" class="btn btn-light init-btn  p-0" onclick="onDeleteRow()">저장</button>
                </div>
              </div>
              <div class="container mt-3">
                <div class="row first-input-box mb-3">
                  <div class="col-12 d-flex align-items-center justify-content-between p-0">
                    <label class="col-form-label" style="width: 100px">체크리스트</br>제목</label>
                    <input type="text" class="form-control chklstTitlePlaceholder" placeholder="${chklstNm}" data-bs-target="#checklistModal" data-bs-toggle="modal" readonly>
                  </div>
                </div>
                <div class="row first-input-box mb-3">
                  <div class="col-12 d-flex align-items-center justify-content-between p-0">
                    <label class="col-form-label" style="width: 100px">마스터</br>체크리스트</label>
                    <input type="text" class="form-control masterChklstTitlePlaceholder" placeholder="${masterChklstNm}" data-bs-target="#masterChecklistModal" data-bs-toggle="modal" readonly>
                  </div>
                </div>
                <div class="row first-input-box">
                  <div class="col-12 d-flex align-items-center justify-content-between p-0">
                    <label class="col-form-label" style="width: 100px">모듈</br>선택</label>
                    <input type="text" class="form-control" placeholder="모듈" readonly>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <%-- top box end--%>

        <%-- middle box start--%>
        <div class="row middle-row d-flex justify-content-between">
          <div class="col-lg-6 col-12 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    대분류 관리
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <div class="button-box d-flex justify-content-end">
                      <div class="my-2 d-flex justify-content-center">
                        <button type="button" class="btn btn-light m-1" onclick="onAddCategoryRow()">추가</button>
                        <button type="button" class="btn btn-light m-1" onclick="onDeleteCategoryRow()">삭제</button>
                      </div>
                    </div>
                    <div>
                      <div id="categoryGrid" style="height: 324px; width:100%" class="ag-theme-quartz mb-2"></div>
                    </div>
                    <div class="update-box border border-light-subtle mb-2">
                      <div class="title-box">
                        <span class="m-3" style="font: 400 15px Noto Sans KR;">대분류 등록 및 수정</span>
                        <div class="my-3">
                          <button type="button" class="btn btn-primary me-3 ctg-save-btn" onclick="ctgSaveOrUpdate()" disabled>저장</button>
                        </div>
                      </div>
                      <div class="container">
                        <div class="update-box-content">
                          <div class="row row-cols-3 first-input-box mb-3">
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 ctg-nm" style="min-width: 50px;">대분류명</label>
                              <input type="text" class="form-control ctg-input" placeholder="대분류명">
                            </div>
                            <div class="col-12 col-lg-3 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 stnd-score" style="min-width: 50px;">기준점수</label>
                              <input type="text" class="form-control ctg-stnd-score" placeholder="0">
                            </div>
                            <div class="col-12 col-lg-3 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 ctg-use-w" style="min-width: 50px;">사용여부</label>
                              <input type="checkbox" class="form-check-label ctg-use-w-check">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-12 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    중분류 관리
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <div class="button-box d-flex justify-content-end">
                      <div class="my-2 d-flex justify-content-center">
                        <button type="button" class="btn btn-light m-1" onclick="onAddSubCategoryRow()">추가</button>
                        <button type="button" class="btn btn-light m-1" onclick="onDeleteSubCategoryRow()">삭제</button>
                      </div>
                    </div>
                    <div>
                      <div id="subCategoryGrid" style="height: 324px; width:100%" class="ag-theme-quartz mb-2"></div>
                    </div>
                    <div class="update-box border border-light-subtle mb-2">
                      <div class="title-box">
                        <span class="m-3" style="font: 400 15px Noto Sans KR;">중분류 등록 및 수정</span>
                        <div class="my-3">
                          <button type="button" class="btn btn-primary me-3 sub-ctg-save-btn" disabled>저장</button>
                        </div>
                      </div>
                      <div class="container">
                        <div class="update-box-content">
                          <div class="row row-cols-2 first-input-box mb-3">
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 sub-ctg-nm" style="min-width: 50px;">중분류명</label>
                              <input type="text" class="form-control" placeholder="중분류명">
                            </div>
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 sub-ctg-use-w" style="min-width: 50px;">사용여부</label>
                              <input type="checkbox" class="form-check-label">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-12 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    평가항목관리
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    <div class="button-box d-flex justify-content-end">
                      <div class="my-2 d-flex justify-content-center">
                        <button type="button" class="btn btn-light m-1" onclick="onAddEvaluationRow()">추가</button>
                        <button type="button" class="btn btn-light m-1" onclick="onDeleteEvaluationRow()">삭제</button>
                      </div>
                    </div>
                    <div>
                      <div id="evaluationGrid" style="height: 424px; width:100%" class="ag-theme-quartz mb-2"></div>
                    </div>
                    <div class="update-box border border-light-subtle mb-2">
                      <div class="title-box">
                        <span class="m-3" style="font: 400 15px Noto Sans KR;">평가항목 등록 및 수정</span>
                        <div class="my-3">
                          <button type="button" class="btn btn-primary me-3 evit-save-btn" disabled>저장</button>
                        </div>
                      </div>
                      <div class="container">
                        <div class="update-box-content">
                          <div class="row first-input-box mb-3">
                            <div class="col-12 col-lg-12 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 evit-nm" style="min-width: 50px;">평가항목</label>
                              <input type="text" class="form-control" placeholder="평가항목">
                            </div>
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 evit-type-nm" style="min-width: 50px;">평가항목유형</label>
                              <input type="text" class="form-control" placeholder="평가항목유형" list="evaluationOptions">
                              <datalist id="evaluationOptions">
                                <option value="Y/N">
                                <option value="선택지형">
                                <option value="단답형">
                              </datalist>
                            </div>
                            <div class="col-12 col-lg-3 d-flex align-items-center mb-2 suspention position-relative">
                              <label class="col-form-label me-2 evit-score" style="min-width: 22px;">점수</label>
                              <input type="text" class="form-control" placeholder="100">
                            </div>
                            <div class="col-12 col-lg-3 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 evit-use-w" style="min-width: 50px;">사용여부</label>
                              <input type="checkbox" class="form-check-label">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-12 accordion-box">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    선택지관리
                  </button>
                </h2>
                <div id="collapseFour" class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    <div class="button-box d-flex justify-content-end">
                      <div class="my-2 d-flex justify-content-center">
                        <button type="button" class="btn btn-light m-1" onclick="onAddChoiceListRow()">추가</button>
                        <button type="button" class="btn btn-light m-1" onclick="onDeleteChoiceListRow()">삭제</button>
                      </div>
                    </div>
                    <div>
                      <div id="choiceListGrid" style="height: 370px; width:100%" class="ag-theme-quartz mb-2"></div>
                    </div>
                    <div class="update-box border border-light-subtle mb-2">
                      <div class="title-box">
                        <span class="m-3" style="font: 400 15px Noto Sans KR;">선택지 등록 및 수정</span>
                        <div class="my-3">
                          <button type="button" class="btn btn-primary me-3 chclst-save-btn" disabled>저장</button>
                        </div>
                      </div>
                      <div class="container">
                        <div class="update-box-content">
                          <div class="row first-input-box mb-3">
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 chclst-nm" style="min-width: 50px;">선택지<br>내용</label>
                              <input type="text" class="form-control" placeholder="적합">
                            </div>
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2">
                              <label class="col-form-label me-2 chclst-use-w" style="min-width: 50px;">사용여부</label>
                              <input type="checkbox" class="form-check-label">
                            </div>
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2 position-relative">
                              <label class="col-form-label me-2 chclst-score" style="min-width: 50px;">선택지<br>점수</label>
                              <input type="text" class="form-control" placeholder="100">
                            </div>
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2 position-relative">
                              <label class="col-form-label me-2 chclst-nprfsCd" style="min-width: 50px;">부적합<br>강도</label>
                              <input type="text" class="form-control" list="strengthOptions">
                              <datalist id="strengthOptions">
                                <option value="크리티컬">
                                <option value="메이져">
                                <option value="마이너">
                              </datalist>
                            </div>
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2 penalty position-relative">
                              <label class="col-form-label me-2 chclst-penalty" style="min-width: 50px;">과태료</label>
                              <input type="text" class="form-control penalty-input" placeholder="0">
                              <span class="unit" style="margin-right: 8px; font: 300 11px Noto Sans KR">만원</span>
                            </div>
                            <div class="col-12 col-lg-6 d-flex align-items-center mb-2 suspention position-relative">
                              <label class="col-form-label me-2 chclst-bsnSspnDaynum" style="min-width: 50px;">영업정지</label>
                              <input type="text" class="form-control suspention-input" placeholder="0">
                              <span class="unit" style="margin-right: 8px; font: 300 11px Noto Sans KR">일</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <%-- middle box End--%>


        <%-------------  checklist modal -------------%>
        <div class="modal fade" id="checklistModal" aria-hidden="true" aria-labelledby="checklistList" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <%-------------- header --------------%>
              <div class="modal-header">
                <span class="modal-title fs-5" id="checklistList" style="font: 450 16px 'Noto Sans KR'">
                  체크리스트 선택
                </span>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <%-------------- header --------------%>
              <%-------------- body --------------%>
              <div class="modal-body">
                <div class="input-group mb-3 modal-search-box" style="    padding: .5rem 1rem;">
                  <input type="text" class="form-control me-2 chklst-search-box" placeholder="체크리스트 검색" aria-label="Recipient's username" aria-describedby="button-addon">
                  <button class="btn btn-outline-secondary chklst-search-btn" type="button" id="button-addon">검색</button>
                </div>
                <ol class="list-group"></ol>
              </div>
              <%-------------- modal body --------------%>
              <%-------------- modal footer --------------%>
              <div class="modal-footer">
                <button class="btn btn-primary chklstSelectBtn" data-bs-dismiss="modal">선택</button>
              </div>
              <%-------------- modal footer --------------%>
            </div>
          </div>
        </div>
        <%-- checklist modal end --%>

        <%--   checklist second modal start     --%>
        <div class="modal fade" id="checklistPreviewModal" aria-hidden="false" aria-labelledby="details" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
              <%--------------          header       ----------------------%>
              <div class="modal-header">
                <div class="large-category-group">
                </div>
                <button class="btn back-btn" data-bs-target="#checklistModal" data-bs-toggle="modal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                  </svg>
                </button>
              </div>
              <%--------------           header       ----------------------%>
              <%--------------           body       ----------------------%>
              <div class="modal-body subCategory">
                <div class="row row-cols-2 d-flex justify-content-between category">
                </div>
                <div class="d-flex flex-row justify-content-end align-items-center score">
                  <span class="me-2">총</span>
                  <span style="color: #D90D0D">100</span>
                  <span class="me-2">점</span>
                </div>
              </div>
              <%--------------           body       ----------------------%>
            </div>
          </div>
        </div>
        <%--  checklist second modal end     --%>


        <%------------- master checklist modal -------------%>
        <div class="modal fade" id="masterChecklistModal" aria-hidden="true" aria-labelledby="masterChecklistList" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <%-------------- header --------------%>
              <div class="modal-header">
              <span class="modal-title fs-5" id="masterChecklistList" style="font: 450 16px 'Noto Sans KR'">
                마스터 체크리스트 선택
              </span>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <%-------------- header --------------%>
              <%-------------- body --------------%>
              <div class="modal-body">
                <div class="input-group mb-3 modal-search-box" style="padding: .5rem 1rem;">
                  <input type="text" class="form-control me-2 master-chklst-search-box" placeholder="체크리스트 검색" aria-label="Recipient's username" aria-describedby="button-addon3">
                  <button class="btn btn-outline-secondary master-chklst-search-btn" type="button" id="button-addon2">검색</button>
                </div>
                <ol class="master-list-group list-group"></ol>
              </div>
              <%-------------- modal body --------------%>
              <%-------------- modal footer --------------%>
              <div class="modal-footer">
                <button class="btn btn-primary masterChklstSelectBtn" data-bs-dismiss="modal">선택</button>
              </div>
              <%-------------- modal footer --------------%>
            </div>
          </div>
        </div>
        <%-- master checklist modal end --%>

          <%--  master checklist second modal start     --%>
          <div class="modal fade" id="masterChecklistPreviewBtn" aria-hidden="false" aria-labelledby="details" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
              <div class="modal-content">
                <%--------------          header       ----------------------%>
                <div class="modal-header">
                  <div class="large-category-group">
                  </div>
                  <button class="btn back-btn" data-bs-target="#masterChecklistModal" data-bs-toggle="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                    </svg>
                  </button>
                </div>
                <%--------------           header       ----------------------%>
                <%--------------           body       ----------------------%>
                <div class="modal-body subCategory">
                  <div class="row row-cols-2 d-flex justify-content-between category">
                  </div>
                  <div class="d-flex flex-row justify-content-end align-items-center score">
                    <span class="me-2">총</span>
                    <span style="color: #D90D0D">100</span>
                    <span class="me-2">점</span>
                  </div>
                </div>
                <%--------------           body       ----------------------%>
              </div>
            </div>
          </div>
          <%-- master checklist second modal end     --%>










    </div>
  </main>
</div>
<script>
  const chklstId = "${chklstId}";
  const chklstNm = "${chklstNm}";
</script>
<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/category.js"
></script>
<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/sub_category.js"
></script>
<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/evaluation.js"
></script>
<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/choice-list.js"
></script>
<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/modal.js"
></script>
<script defer
        type="application/javascript"
        src="../../../../../resources/js/master/checklist/inspection_list_manage/master-modal.js"
></script>
  <script defer
          type="application/javascript"
          src="../../../../../resources/js/master/checklist/inspection_list_manage/checklist-preview-modal.js"
  ></script>
</body>
</html>
