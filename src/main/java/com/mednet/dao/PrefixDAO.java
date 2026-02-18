package com.mednet.dao;


import com.mednet.model.Prefix;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class PrefixDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Transactional
    public void save(Prefix prefix) {
        sessionFactory.getCurrentSession().save(prefix);
    }

    @Transactional(readOnly = true)
    public List<Prefix> getAll() {
        return sessionFactory
                .getCurrentSession()
                .createQuery("from Prefix", Prefix.class)
                .list();
    }

    @Transactional(readOnly = true)
    public Prefix getById(int id) {
        return sessionFactory.getCurrentSession().get(Prefix.class, id);
    }

    @Transactional
    public void delete(int id) {
        Prefix p = getById(id);
        if (p != null) {
            sessionFactory.getCurrentSession().delete(p);
        }
    }

    @Transactional
    public void update(Prefix prefix) {
        sessionFactory.getCurrentSession().update(prefix);
    }
}

