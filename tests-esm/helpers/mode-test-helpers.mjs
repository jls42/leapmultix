export function createUserStateMock(userStore) {
  return {
    UserState: {
      getCurrentUserData: () => userStore,
      updateUserData: updates => Object.assign(userStore, updates),
    },
  };
}

export function createSlidesMock(jestApi) {
  return {
    goToSlide: jestApi.fn(),
    showSlide: jestApi.fn(),
    hideAllSlides: jestApi.fn(),
    nextSlide: jestApi.fn(),
    prevSlide: jestApi.fn(),
  };
}
