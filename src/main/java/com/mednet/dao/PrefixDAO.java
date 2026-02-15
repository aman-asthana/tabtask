package com.mednet.dao;

import com.mednet.config.HibernateConfig;
import com.mednet.model.Prefix;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PrefixDAO {

    // Use HibernateConfig instead of XML configuration
    private static SessionFactory factory = HibernateConfig.getSessionFactory();

    public void save(Prefix prefix) {
        Session session = factory.openSession();
        try {
            session.beginTransaction();
            session.save(prefix);
            session.getTransaction().commit();
        } catch (Exception e) {
            if (session.getTransaction() != null) session.getTransaction().rollback();
            e.printStackTrace();
            throw new RuntimeException("Failed to save prefix: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }

    public List<Prefix> getAll() {
        Session session = factory.openSession();
        try {
            List<Prefix> list = session.createQuery("from Prefix", Prefix.class).list();
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get all prefixes: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }

    public Prefix getById(int id) {
        Session session = factory.openSession();
        try {
            Prefix p = session.get(Prefix.class, id);
            return p;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get prefix by id: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }

    public void delete(int id) {
        Session session = factory.openSession();
        try {
            session.beginTransaction();
            Prefix p = session.get(Prefix.class, id);
            if (p != null) {
                session.delete(p);
            }
            session.getTransaction().commit();
        } catch (Exception e) {
            if (session.getTransaction() != null) session.getTransaction().rollback();
            e.printStackTrace();
            throw new RuntimeException("Failed to delete prefix: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }

    public void update(Prefix prefix) {
        Session session = factory.openSession();
        try {
            session.beginTransaction();
            session.update(prefix);
            session.getTransaction().commit();
        } catch (Exception e) {
            if (session.getTransaction() != null) session.getTransaction().rollback();
            e.printStackTrace();
            throw new RuntimeException("Failed to update prefix: " + e.getMessage(), e);
        } finally {
            session.close();
        }
    }
}
