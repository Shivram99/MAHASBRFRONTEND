// user.model.ts
export class User {
    id!: number;
    username!: string;
    phoneNo!: string;
    email!: string;
    password!: string;
    roles!: Role[];

    constructor(username: string, password: string, email: string, phoneNo: string) {
      this.username = username;
      this.password = password;
      this.email = email;
      this.phoneNo = phoneNo;
    }
  }
  
  export class Role {
    id!: number;
    name!: string;
  }
  