package com.mahasbr.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;



@Data
@MappedSuperclass
public abstract class Auditable {
	
    @Column(name = "created_user_id")
    private Long createdUserId;

    @Column(name = "updated_user_id")
    private Long updatedUserId;

    @Column(name = "created_date_time")
    private Date createdDateTime;

    @Column(name = "updated_date_time")
    private Date updatedDateTime;

}