package com.sims.master.inspection_list_manage.service;

import com.sims.config.common.aop.PRoleCheck;
import com.sims.master.inspection_list_manage.mapper.InspectionListManageMapper;
import com.sims.master.inspection_list_manage.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Description 점검 항목 관리 서비스 구현 클래스
 * @Author 유재원
 * @Date 2024.10.31
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionListManageServiceImpl implements InspectionListManageService{

    private final InspectionListManageMapper inspectionListManageMapper;
    @Override
    @Transactional(readOnly = true)
    public InspectionPageResponse selectChklstNmByChklstId(String chklstId) {

        return inspectionListManageMapper.selectChklstNmByChklstId(chklstId);
    }

    @Override
    @Transactional(readOnly = true)
    public String selectChklstIdByChklstNm(String chklstNm) {
        return inspectionListManageMapper.selectChklstIdByChklstNm(chklstNm);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CtgResponse> selectCtgByChklstId(String chklstId) {
        log.info("chklstId = {}", chklstId);

        return inspectionListManageMapper.selectCtgByChklstId(chklstId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubCtgResponse> selectSubCtgByChklstIdAndCtgNm(String chklstId, String CtgNm) {

        return inspectionListManageMapper.selectSubCtgByChklstIdAndCtgNm(chklstId, CtgNm);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvitResponse> selectEvitByCtgNmAndCtgId(String ctgId, String ctgNm) {
        log.info("result = {}", inspectionListManageMapper.selectEvitByCtgNmAndCtgId(ctgId, ctgNm));
        return inspectionListManageMapper.selectEvitByCtgNmAndCtgId(ctgId, ctgNm);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChclstResponse> selectEvitChclstByCtgIdAndEvitNm(String ctgId, String evitNm) {
        return inspectionListManageMapper.selectEvitChclstByCtgIdAndEvitNm(ctgId, evitNm);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int insertOrUpdateCtg(List<CtgRequest> ctgRequest) {
        String auth  = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("auth = {}", auth);
        ctgRequest.forEach(ctg -> {
            ctg.setCreMbrId(auth);
//            ctg.setCtgId(ctg.getCtgId().replace("new", ""));
            if(ctg.getCtgId().contains("new")){
                ctg.setCtgId(null);
            }
        });

        return inspectionListManageMapper.insertOrUpdateCtg(ctgRequest);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int deleteCtg(List<String> ctgId) {
        ctgId.forEach(index -> {
            log.info("id = {}", index);
            index = index.replace("new", ""); // 변경된 값을 index에 할당
            log.info("id = {}", index);
        });
        return inspectionListManageMapper.deleteCtg(ctgId);
    }


    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int insertOrUpdateSubCtg(List<SubCtgRequest> subCtgRequest) {
        String auth  = SecurityContextHolder.getContext().getAuthentication().getName();
        subCtgRequest.forEach(subCtg -> {
            subCtg.setCreMbrId(auth);
            subCtg.setCtgId(subCtg.getCtgId().replace("new", ""));
            if(subCtg.getCtgId().equals("")){
                subCtg.setCtgId("0");
            }
        });
        return inspectionListManageMapper.insertOrUpdateSubCtg(subCtgRequest);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int deleteSubCtg(List<String> subCtgId) {
        return inspectionListManageMapper.deleteSubCtg(subCtgId);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int insertOrUpdateEvit(List<EvitRequest> evitRequest) {
        String auth = SecurityContextHolder.getContext().getAuthentication().getName();
        evitRequest.forEach(evit -> {
            evit.setCreMbrId(auth);
            evit.setEvitId(evit.getEvitId().replace("new", ""));
        });

        return inspectionListManageMapper.insertOrUpdateEvit(evitRequest);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int deleteChklstEvit(List<String> evitId) {
        return inspectionListManageMapper.deleteChklstEvit(evitId);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int insertOrUpdateEvitChclst(List<ChclstRequest> chclstRequest) {
        String auth = SecurityContextHolder.getContext().getAuthentication().getName();
        chclstRequest.forEach(chclst -> {
            chclst.setCreMbrId(auth);
            chclst.setChclstId(chclst.getChclstId().replace("new", ""));
        });
        log.info("chclstRequest = {}", chclstRequest);
        return inspectionListManageMapper.insertOrUpdateEvitChclst(chclstRequest);
    }

    @Override
    @PRoleCheck
    @Transactional(rollbackFor = Exception.class)
    public int deleteEvitChclst(List<String> chclstId) {
        return inspectionListManageMapper.deleteEvitChclst(chclstId);
    }
}
