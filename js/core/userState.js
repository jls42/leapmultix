import { UserManager } from '../userManager.js';

export class UserState {
  static getCurrentUserData() {
    return UserManager.getCurrentUserData();
  }

  static updateUserData(data) {
    return UserManager.updateCurrentUserData(data);
  }
}

// Plus d'export global: les modules consomment UserState via import ESM
