package com.mahasbr.entity;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor  
@Entity
@Table(name = "department_mst")
public class DepartmentMst extends Auditable {
 
	    @Id
	    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "department_seq_generator")
	    @SequenceGenerator(name="department_seq_generator", sequenceName = "department_seq", allocationSize=1)
	    private Long departmentId;

	    @Column(length = 20)
	    private String departmentName;
	    
	    
	    @OneToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id") // name of the foreign key column in department_mst table
	    private User user;
	    
	    

}
