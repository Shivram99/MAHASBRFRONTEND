import { DepartmentMst } from "./department-mst";

// user.model.ts
export class User {
    id!: number;
    username!: string;
    phoneNo!: string;
    email!: string;
    password!: string;
    roles!: Role[];
    departmentId?: number; 


    constructor(username: string, password: string, email: string, phoneNo: string, departmentId:number) {
      this.username = username;
      this.password = password;
      this.email = email;
      this.phoneNo = phoneNo;
      this.departmentId = departmentId;
    }

    
  }
  
  export class Role {
    id!: number;
    name!: string;
  }
  