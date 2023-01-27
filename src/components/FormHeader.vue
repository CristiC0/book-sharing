<template>
  <div class="cover-section">
    <img src="@/assets/icons/DAVA_BIG.D.png" alt="logo-endava" />
    <div class="cover-title">
      <p>BOOK</p>
      <br />
      <P>SHARING</P>
    </div>
  </div>
</template>

<style scoped>
.cover-section {
  width: 40%;
  height: 100vh;
  background-color: var(--vt-c-black-mute);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
img {
  top: 0;
  left: 0;
  padding: 2rem;
  position: absolute;
  width: 15rem;
}

p {
  display: inline;
  font-size: 3em;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 3rem;
  color: white;
}
p:last-child {
  padding-left: 3rem;
}

@media (max-width: 1000px) {
  .cover-section {
    width: 100%;
    height: 4rem;
    align-items: flex-end;
  }
  .cover-title {
    display: flex;
    gap: 0.5em;
    margin-right: 1em;
  }
  img {
    width: 8rem;
    padding: 1rem;
  }
  p {
    font-size: 1.5em;
    margin: 0;
  }
  p:last-child {
    padding: 0;
  }
}
</style>
