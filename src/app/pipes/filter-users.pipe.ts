import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers',
  standalone: false
})
export class FilterUsersPipe implements PipeTransform {
  transform(users: any[], searchText: string): any[] {
    if (!users || !searchText) return users;

    searchText = searchText.toLowerCase();

    return users.filter(user =>
      (user.username?.toLowerCase().includes(searchText)) ||
      (user.email?.toLowerCase().includes(searchText)) ||
      (user.userProfile?.fullName?.toLowerCase().includes(searchText)) ||
      (user.userProfile?.officeName?.toLowerCase().includes(searchText)) ||
      (user.userProfile?.mobileNumber?.toString().includes(searchText)) ||
      // 🔹 New role filter
      (Array.isArray(user.roles) && user.roles.some(
        (role: string) => role.toLowerCase().includes(searchText)
      ))
    );
  }
}