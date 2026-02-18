package com.mednet.service;

import java.util.List;

import com.mednet.dao.PrefixDAO;
import com.mednet.model.Prefix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("prefixService")
@Transactional
public class PrefixService {

    @Autowired
    public PrefixDAO dao;

    @Autowired
    public PrefixService(PrefixDAO dao) {
        this.dao = dao;
    }


    public void addPrefix(String prefix, String name, String gender, String relation) {
        Prefix p = new Prefix();
        p.setPrefix(prefix);
        p.setName(name);
        p.setGender(gender);
        p.setRelation(relation);
        dao.save(p);
    }

    public List<Prefix> listPrefixes() {
        return dao.getAll();
    }

    public void deletePrefix(int id) {
        dao.delete(id);
    }

    public void updatePrefix(int id, String prefix, String name, String gender, String relation) {
        Prefix p = new Prefix();
        p.setId(id);
        p.setPrefix(prefix);
        p.setName(name);
        p.setGender(gender);
        p.setRelation(relation);
        dao.update(p);
    }


}