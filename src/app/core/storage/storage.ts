export interface IStorage {
  updateUserData(T);

  clearUserData();

  getAuthToken();
}
