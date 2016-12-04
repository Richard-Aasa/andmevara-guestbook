package com.andmevara;

import org.hibernate.validator.constraints.Email;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

// Mudel
@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Email
    private String email;
    @Basic(optional = false)
    @Column(length = 50)
    private String name;
    @Basic(optional = false)
    @Column(length = 1000)
    private String comment;

    @Column(insertable=false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Temporal(TemporalType.TIMESTAMP)
    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    @PrePersist
    void onCreate() {
        this.setCreatedDate(new Timestamp((new Date()).getTime()));
    }
}
