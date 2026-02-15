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
