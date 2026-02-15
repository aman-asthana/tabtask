package com.mednet.dao;

import com.mednet.config.HibernateConfig;
import com.mednet.model.Prefix;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PrefixDAO {

    private SessionFactory getFactory() {
        return HibernateConfig.getSessionFactory();
    }

    public void save(Prefix prefix) {
        Session session = getFactory().openSession();
        Transaction tx = null;
        try {
            tx = session.beginTransaction();
            session.save(prefix);
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw new RuntimeException("Failed to save: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }

    public List<Prefix> getAll() {
        Session session = getFactory().openSession();
        try {
            return session.createQuery("from Prefix", Prefix.class).list();
        } finally {
            session.close();
        }
    }

    public Prefix getById(int id) {
        Session session = getFactory().openSession();
        try {
            return session.get(Prefix.class, id);
        } finally {
            session.close();
        }
    }

    public void delete(int id) {
        Session session = getFactory().openSession();
        Transaction tx = null;
        try {
            tx = session.beginTransaction();
            Prefix p = session.get(Prefix.class, id);
            if (p != null) {
                session.delete(p);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw new RuntimeException("Failed to delete: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }

    public void update(Prefix prefix) {
        Session session = getFactory().openSession();
        Transaction tx = null;
        try {
            tx = session.beginTransaction();
            session.update(prefix);
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw new RuntimeException("Failed to update: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }
}
