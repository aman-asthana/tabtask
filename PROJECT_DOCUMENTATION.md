# TabTask Project - Complete Documentation

## Project Overview
This is a **Spring MVC + Hibernate + DWR + ExtJS** based web application that manages prefix data with the following features:
- CRUD operations (Create, Read, Update, Delete)
- Excel export/import
- PDF export
- Web service (JSON API)
- Pagination and Filtering

---

## Folder Structure

```
tabtask/
├── pom.xml                              # Maven dependencies
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── mednet/
│       │           ├── config/
│       │           │   ├── HibernateConfig.java   # Database configuration
│       │           │   └── WebConfig.java         # Spring MVC configuration
│       │           ├── controller/
│       │           │   ├── ExcelController.java   # Excel APIs
│       │           │   ├── PdfController.java     # PDF APIs
│       │           │   └── PrefixController.java  # Prefix CRUD APIs
│       │           ├── dao/
│       │           │   └── PrefixDAO.java         # Database operations
│       │           ├── model/
│       │           │   └── Prefix.java            # Entity class
│       │           └── service/
│       │               ├── ExcelService.java      # Excel logic
│       │               ├── PdfService.java        # PDF logic
│       │               └── PrefixService.java     # Business logic
│       ├── resources/
│       │   └── (empty - using Java config)
│       └── webapp/
│           ├── index.jsp                 # Main HTML page
│           ├── js/
│           │   ├── main.js               # App entry point
│           │   ├── prefix.js             # Add form tab
│           │   ├── paging.js             # List tab with pagination
│           │   ├── dropdown.js           # Dropdown tab
│           │   ├── popup.js              # Popup tab
│           │   ├── excel.js              # Excel tab
│           │   ├── pdf.js                # PDF tab
│           │   └── webservice.js         # Web service tab
│           └── WEB-INF/
│               ├── web.xml               # Servlet configuration
│               └── dwr.xml               # DWR configuration
```

---

## MVC Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│ Controller  │────▶│   Service   │────▶│     DAO     │
│  (ExtJS)    │◀────│  (REST API) │◀────│  (Logic)    │◀────│ (Database)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                                                           │
       │                    ┌─────────────┐                        │
       └───────────────────▶│     DWR     │◀───────────────────────┘
         (Direct calls)     │   (RPC)     │
                            └─────────────┘
```

### Layer Explanation
| Layer | File | Purpose |
|-------|------|---------|
| **Model** | `Prefix.java` | Data structure (Entity) |
| **View** | `index.jsp`, `js/*.js` | User Interface (ExtJS) |
| **Controller** | `*Controller.java` | HTTP request handling |
| **Service** | `*Service.java` | Business logic |
| **DAO** | `PrefixDAO.java` | Database operations |
| **Config** | `HibernateConfig.java`, `WebConfig.java` | Configuration |

---

## Maven Dependencies List

Search these on **Maven Repository** (https://mvnrepository.com):

| Dependency Name | Search Keyword | Version | Purpose |
|-----------------|----------------|---------|---------|
| Spring Context | `spring-context` | 5.3.30 | Spring core functionality |
| Spring WebMVC | `spring-webmvc` | 5.3.30 | Spring MVC framework |
| Spring ORM | `spring-orm` | 5.3.30 | Hibernate integration |
| Spring TX | `spring-tx` | 5.3.30 | Transaction management (@Transactional) |
| Hibernate Core | `hibernate-core` | 5.6.15.Final | ORM framework |
| MySQL Connector | `mysql-connector-java` | 8.0.33 | MySQL database driver |
| Servlet API | `javax.servlet-api` | 4.0.1 | Servlet support |
| JSP API | `jsp-api` | 2.2 | JSP support |
| JSTL | `jstl` | 1.2 | JSP tag library |
| DWR | `dwr` | 3.0.2-RELEASE | Direct Web Remoting |
| Apache POI | `poi-ooxml` | 5.4.0 | Excel file handling |
| iTextPDF | `itextpdf` | 5.5.13.3 | PDF generation |
| Jackson Databind | `jackson-databind` | 2.15.3 | JSON processing |
| Gson | `gson` | 2.10.1 | Google JSON library |

---

## Step-by-Step Project Setup

### Step 1: Create Maven Project
```bash
mvn archetype:generate -DgroupId=com.mednet -DartifactId=tabtask -DarchetypeArtifactId=maven-archetype-webapp
```

### Step 2: Add Dependencies in pom.xml
Copy the dependencies from the Maven Dependencies List above.

### Step 3: Create Database
```sql
CREATE DATABASE mednet_task;
USE mednet_task;
-- Table will be automatically created by Hibernate (hbm2ddl.auto=update)
```

### Step 4: Create Java Files
Follow the structure given below.

---

## All Java Files with Annotations

### 1. Model - Prefix.java

```java
package com.mednet.model;

import javax.persistence.*;

@Entity
@Table(name = "prefix")
public class Prefix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "prefix", length = 50)
    private String prefix;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "relation", length = 50)
    private String relation;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getPrefix() { return prefix; }
    public void setPrefix(String prefix) { this.prefix = prefix; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }
}
```

#### JPA/Hibernate Annotations Explained

| Annotation | Purpose |
|------------|---------|
| `@Entity` | Marks this class as a database table. Hibernate will map this class to a table. |
| `@Table(name = "prefix")` | Specifies the table name in the database. If not given, class name is used. |
| `@Id` | Marks this field as the primary key of the table. |
| `@GeneratedValue(strategy = GenerationType.IDENTITY)` | Auto-generates the ID value. IDENTITY means the database will auto-increment. |
| `@Column(name = "prefix", length = 50)` | Maps field to a specific column. `length` sets the max characters. |

---

### 2. Config - HibernateConfig.java

```java
package com.mednet.config;

import com.mednet.model.Prefix;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Environment;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.service.ServiceRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class HibernateConfig {

    private static SessionFactory sessionFactory;

    @Bean
    public SessionFactory sessionFactory() {
        if (sessionFactory == null) {
            org.hibernate.cfg.Configuration configuration = new org.hibernate.cfg.Configuration();

            Properties settings = new Properties();
            settings.put(Environment.DRIVER, "com.mysql.cj.jdbc.Driver");
            settings.put(Environment.URL, "jdbc:mysql://localhost:3306/mednet_task");
            settings.put(Environment.USER, "root");
            settings.put(Environment.PASS, "your_password");
            settings.put(Environment.DIALECT, "org.hibernate.dialect.MySQL8Dialect");
            settings.put(Environment.HBM2DDL_AUTO, "update");
            settings.put(Environment.SHOW_SQL, "true");
            settings.put(Environment.CURRENT_SESSION_CONTEXT_CLASS, "thread");
            settings.put(Environment.POOL_SIZE, "5");

            configuration.setProperties(settings);
            configuration.addAnnotatedClass(Prefix.class);

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                    .applySettings(configuration.getProperties())
                    .build();

            sessionFactory = configuration.buildSessionFactory(serviceRegistry);
        }
        return sessionFactory;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new HibernateTransactionManager(sessionFactory());
    }

    public static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            new HibernateConfig().sessionFactory();
        }
        return sessionFactory;
    }
}
```

#### Spring Configuration Annotations Explained

| Annotation | Purpose |
|------------|---------|
| `@Configuration` | Tells Spring this is a configuration class (replaces XML config). |
| `@Bean` | The return value of this method becomes a Spring-managed object (bean). |
| `@EnableTransactionManagement` | Enables support for `@Transactional` annotation in the application. |

#### Hibernate Environment Properties Explained

| Property | Purpose |
|----------|---------|
| `Environment.DRIVER` | JDBC driver class for the database |
| `Environment.URL` | Database connection URL |
| `Environment.USER` | Database username |
| `Environment.PASS` | Database password |
| `Environment.DIALECT` | SQL dialect for the database (MySQL8) |
| `Environment.HBM2DDL_AUTO` | `update` = automatically create/update tables |
| `Environment.SHOW_SQL` | Print SQL queries to console |
| `Environment.POOL_SIZE` | Number of database connections in pool |

---

### 3. Config - WebConfig.java

```java
package com.mednet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
@ComponentScan("com.mednet")
public class WebConfig {

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }
}
```

#### Spring MVC Annotations Explained

| Annotation | Purpose |
|------------|---------|
| `@Configuration` | Marks this as a configuration class |
| `@EnableWebMvc` | Enables Spring MVC features like JSON conversion, request mapping, etc. |
| `@ComponentScan("com.mednet")` | Scans the package for Spring components (@Controller, @Service, @Repository) |

---

### 4. DAO - PrefixDAO.java

```java
package com.mednet.dao;

import com.mednet.config.HibernateConfig;
import com.mednet.model.Prefix;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public class PrefixDAO {

    private static SessionFactory factory = HibernateConfig.getSessionFactory();

    private Session getSession() {
        return factory.openSession();
    }

    @Transactional
    public void save(Prefix prefix) {
        Session session = getSession();
        session.beginTransaction();
        session.save(prefix);
        session.getTransaction().commit();
        session.close();
    }

    @Transactional(readOnly = true)
    public List<Prefix> getAll() {
        Session session = getSession();
        List<Prefix> list = session.createQuery("from Prefix", Prefix.class).list();
        session.close();
        return list;
    }

    @Transactional(readOnly = true)
    public Prefix getById(int id) {
        Session session = getSession();
        Prefix p = session.get(Prefix.class, id);
        session.close();
        return p;
    }

    @Transactional
    public void delete(int id) {
        Session session = getSession();
        session.beginTransaction();
        Prefix p = session.get(Prefix.class, id);
        if (p != null) {
            session.delete(p);
        }
        session.getTransaction().commit();
        session.close();
    }

    @Transactional
    public void update(Prefix prefix) {
        Session session = getSession();
        session.beginTransaction();
        session.update(prefix);
        session.getTransaction().commit();
        session.close();
    }
}
```

#### DAO Annotations Explained

| Annotation | Purpose |
|------------|---------|
| `@Repository` | Marks this class as a DAO (Data Access Object). Spring will manage it. |

#### Transaction Management (Manual)
In the DAO, we use **manual transaction management**:
- `session.beginTransaction()` - Starts the transaction
- `tx.commit()` - Saves changes to database
- `tx.rollback()` - Reverts changes if error occurs
- `session.close()` - Closes the database connection

---

### 5. Service - PrefixService.java

```java
package com.mednet.service;

import com.mednet.dao.PrefixDAO;
import com.mednet.model.Prefix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrefixService {

    private final PrefixDAO dao;

    @Autowired
    public PrefixService(PrefixDAO dao) {
        this.dao = dao;
    }

    // Default constructor for DWR compatibility
    public PrefixService() {
        this.dao = new PrefixDAO();
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
```

#### Service Annotations Explained

| Annotation | Purpose |
|------------|---------|
| `@Service` | Marks this class as a service layer component. Contains business logic. |
| `@Autowired` | Automatically injects the required dependency (PrefixDAO) at runtime. |

---

### 6. Controller - PrefixController.java

```java
package com.mednet.controller;

import com.mednet.model.Prefix;
import com.mednet.service.PrefixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/prefix")
public class PrefixController {

    private final PrefixService prefixService;

    @Autowired
    public PrefixController(PrefixService prefixService) {
        this.prefixService = prefixService;
    }

    @GetMapping
    public List<Prefix> getAll() {
        return prefixService.listPrefixes();
    }

    @PostMapping
    public String create(@RequestBody Prefix p) {
        prefixService.addPrefix(p.getPrefix(), p.getName(), p.getGender(), p.getRelation());
        return "Saved";
    }

    @PutMapping("/{id}")
    public String update(@PathVariable int id, @RequestBody Prefix p) {
        prefixService.updatePrefix(id, p.getPrefix(), p.getName(), p.getGender(), p.getRelation());
        return "Updated";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        prefixService.deletePrefix(id);
        return "Deleted";
    }
}
```

#### Controller Annotations Explained

| Annotation | Purpose |
|------------|---------|
| `@RestController` | Combines `@Controller` and `@ResponseBody`. Returns data directly (JSON). |
| `@RequestMapping("/prefix")` | Base URL path for all methods in this controller. |
| `@GetMapping` | Handles HTTP GET requests. Used for fetching data. |
| `@PostMapping` | Handles HTTP POST requests. Used for creating new data. |
| `@PutMapping("/{id}")` | Handles HTTP PUT requests. Used for updating existing data. |
| `@DeleteMapping("/{id}")` | Handles HTTP DELETE requests. Used for deleting data. |
| `@RequestBody` | Converts JSON request body to Java object automatically. |
| `@PathVariable` | Extracts value from URL path. Example: `/prefix/1` → `id = 1` |

---

### 7. Controller - ExcelController.java

```java
package com.mednet.controller;

import com.mednet.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/excel")
public class ExcelController {

    private final ExcelService excelService;

    @Autowired
    public ExcelController(ExcelService excelService) {
        this.excelService = excelService;
    }

    @GetMapping("/export")
    public void exportExcel(@RequestParam(value = "type", required = false) String type,
                            HttpServletResponse response) throws IOException {
        boolean isTemplate = "template".equalsIgnoreCase(type);
        excelService.exportExcel(response, isTemplate);
    }

    @PostMapping("/upload")
    public String uploadExcel(@RequestParam("file") MultipartFile file) throws IOException {
        return excelService.uploadExcel(file.getInputStream());
    }
}
```

#### Additional Controller Annotations

| Annotation | Purpose |
|------------|---------|
| `@RequestParam` | Gets query parameter from URL. Example: `?type=template` → `type = "template"` |
| `@RequestParam("file") MultipartFile` | Gets the uploaded file from form data. |

---

### 8. Controller - PdfController.java

```java
package com.mednet.controller;

import com.mednet.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/pdf")
public class PdfController {

    private final PdfService pdfService;

    @Autowired
    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @GetMapping("/export")
    public void exportPdf(HttpServletResponse response) throws Exception {
        pdfService.exportPdf(response);
    }
}
```

---

## XML Configuration Files

### web.xml - Servlet Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" version="3.1">

    <!-- DWR Servlet -->
    <servlet>
        <servlet-name>dwr-invoker</servlet-name>
        <servlet-class>org.directwebremoting.servlet.DwrServlet</servlet-class>
        <init-param>
            <param-name>debug</param-name>
            <param-value>true</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dwr-invoker</servlet-name>
        <url-pattern>/dwr/*</url-pattern>
    </servlet-mapping>

    <!-- Spring MVC Servlet -->
    <servlet>
        <servlet-name>spring</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextClass</param-name>
            <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
        </init-param>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>com.mednet.config.WebConfig</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
        <multipart-config>
            <max-file-size>10485760</max-file-size>
        </multipart-config>
    </servlet>
    <servlet-mapping>
        <servlet-name>spring</servlet-name>
        <url-pattern>/api/*</url-pattern>
    </servlet-mapping>
</web-app>
```

### dwr.xml - DWR Configuration

```xml
<!DOCTYPE dwr PUBLIC "-//GetAhead Limited//DTD Direct Web Remoting 3.0//EN"
    "http://getahead.org/dwr/dwr30.dtd">
<dwr>
    <allow>
        <create creator="new" javascript="PrefixService">
            <param name="class" value="com.mednet.service.PrefixService"/>
        </create>
        <convert converter="bean" match="com.mednet.model.Prefix"/>
    </allow>
</dwr>
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/prefix` | Get all prefixes |
| POST | `/api/prefix` | Create new prefix |
| PUT | `/api/prefix/{id}` | Update prefix by ID |
| DELETE | `/api/prefix/{id}` | Delete prefix by ID |
| GET | `/api/excel/export` | Download Excel file |
| GET | `/api/excel/export?type=template` | Download empty Excel template |
| POST | `/api/excel/upload` | Upload Excel file |
| GET | `/api/pdf/export` | Download PDF file |

---

## All Annotations Summary

### Spring Core Annotations
| Annotation | Package | Purpose |
|------------|---------|---------|
| `@Configuration` | `org.springframework.context.annotation` | Marks class as configuration |
| `@Bean` | `org.springframework.context.annotation` | Creates a Spring-managed bean |
| `@ComponentScan` | `org.springframework.context.annotation` | Scans packages for components |
| `@Autowired` | `org.springframework.beans.factory.annotation` | Automatic dependency injection |

### Spring MVC Annotations
| Annotation | Package | Purpose |
|------------|---------|---------|
| `@EnableWebMvc` | `org.springframework.web.servlet.config.annotation` | Enables Spring MVC |
| `@RestController` | `org.springframework.web.bind.annotation` | REST API controller |
| `@RequestMapping` | `org.springframework.web.bind.annotation` | URL mapping |
| `@GetMapping` | `org.springframework.web.bind.annotation` | HTTP GET |
| `@PostMapping` | `org.springframework.web.bind.annotation` | HTTP POST |
| `@PutMapping` | `org.springframework.web.bind.annotation` | HTTP PUT |
| `@DeleteMapping` | `org.springframework.web.bind.annotation` | HTTP DELETE |
| `@RequestBody` | `org.springframework.web.bind.annotation` | JSON to Java object |
| `@PathVariable` | `org.springframework.web.bind.annotation` | URL path variable |
| `@RequestParam` | `org.springframework.web.bind.annotation` | Query parameter |

### Spring Stereotype Annotations
| Annotation | Package | Purpose |
|------------|---------|---------|
| `@Service` | `org.springframework.stereotype` | Service layer component |
| `@Repository` | `org.springframework.stereotype` | DAO layer component |

### Spring Transaction Annotations
| Annotation | Package | Purpose |
|------------|---------|---------|
| `@EnableTransactionManagement` | `org.springframework.transaction.annotation` | Enables @Transactional support |
| `@Transactional` | `org.springframework.transaction.annotation` | Wraps method in transaction |
| `@Transactional(readOnly = true)` | `org.springframework.transaction.annotation` | Read-only transaction |

### JPA/Hibernate Annotations
| Annotation | Package | Purpose |
|------------|---------|---------|
| `@Entity` | `javax.persistence` | Maps class to database table |
| `@Table` | `javax.persistence` | Specifies table name |
| `@Id` | `javax.persistence` | Primary key field |
| `@GeneratedValue` | `javax.persistence` | Auto-generate ID |
| `@Column` | `javax.persistence` | Maps field to column |

---

## Build and Run

```bash
# Build the project
mvn clean install

# Deploy
Copy target/tabtask.war to Tomcat webapps/ folder

# Access the application
http://localhost:8080/tabtask/
```

---

## Checklist to Create Project from Scratch

1. [ ] Create Maven webapp project
2. [ ] Add all dependencies in pom.xml
3. [ ] Create database in MySQL: `CREATE DATABASE mednet_task;`
4. [ ] Create package structure: `com.mednet.{config,controller,dao,model,service}`
5. [ ] Create `Prefix.java` (Model with @Entity, @Table, @Id, @Column)
6. [ ] Create `HibernateConfig.java` (Database config with @Configuration, @Bean)
7. [ ] Create `WebConfig.java` (Spring MVC config with @EnableWebMvc, @ComponentScan)
8. [ ] Create `PrefixDAO.java` (Database operations with @Repository, @Transactional)
9. [ ] Create `PrefixService.java` (Business logic with @Service, @Autowired)
10. [ ] Create `PrefixController.java` (REST APIs with @RestController, @GetMapping, etc.)
11. [ ] Create `ExcelController.java` and `PdfController.java`
12. [ ] Create `ExcelService.java` and `PdfService.java`
13. [ ] Create `web.xml` (Servlet mapping)
14. [ ] Create `dwr.xml` (DWR configuration)
15. [ ] Create `index.jsp` (Frontend page)
16. [ ] Create JavaScript files for each tab
17. [ ] Build with Maven and deploy to Tomcat

---

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| 404 on API calls | Check `/api` prefix in web.xml and controller |
| DWR not working | Check dwr.xml and script includes in index.jsp |
| Database connection failed | Verify credentials in HibernateConfig |
| Table not created | Ensure `HBM2DDL_AUTO` is set to `update` |
| Transaction errors | Make sure @EnableTransactionManagement is present |

---

**Project Documentation - Spring MVC + Hibernate + DWR + ExtJS**

