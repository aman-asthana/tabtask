package com.mednet.config;

import com.mednet.model.Prefix;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Environment;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.service.ServiceRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class HibernateConfig {

    private static SessionFactory sessionFactory;

    @Bean
    public SessionFactory sessionFactory() {
        if (sessionFactory == null) {
            try {
                org.hibernate.cfg.Configuration configuration = new org.hibernate.cfg.Configuration();

                Properties settings = new Properties();
                settings.put(Environment.DRIVER, "com.mysql.cj.jdbc.Driver");
                settings.put(Environment.URL, "jdbc:mysql://localhost:3306/mednet_task");
                settings.put(Environment.USER, "root");
                settings.put(Environment.PASS, "amaN@123");
                settings.put(Environment.DIALECT, "org.hibernate.dialect.MySQL8Dialect");
                settings.put(Environment.HBM2DDL_AUTO, "update");
                settings.put(Environment.SHOW_SQL, "true");
                settings.put(Environment.CURRENT_SESSION_CONTEXT_CLASS, "thread");
                settings.put(Environment.POOL_SIZE, "10");

                configuration.setProperties(settings);
                configuration.addAnnotatedClass(Prefix.class);

                ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                        .applySettings(configuration.getProperties())
                        .build();

                sessionFactory = configuration.buildSessionFactory(serviceRegistry);
                System.out.println("Hibernate SessionFactory created successfully!");

            } catch (Exception e) {
                System.err.println("SessionFactory creation failed: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to create SessionFactory", e);
            }
        }
        return sessionFactory;
    }


    public static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            new HibernateConfig().sessionFactory();
        }
        return sessionFactory;
    }
}
