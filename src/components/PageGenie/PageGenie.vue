<template>
  <div class="page">
    <div class="side-wrap side-left-wrap">
      <div class="header-wrap side-header-wrap">
        <svg-icon iconClass="navi-page" />
        页面设计器
      </div>
      <div class="side-body-wrap"></div>
    </div>
    <div class="main-wrap">
      <div class="header-wrap main-header-wrap">
        <div class="main-header-inner">
          <div class="tools-bar left-tools-bar">1</div>
          <div class="tools-bar center-tools-bar">2</div>
          <div class="tools-bar right-tools-bar">3</div>
        </div>
      </div>
      <div class="main-body-wrap"></div>
    </div>
    <div class="side-wrap side-right-wrap">
      <div class="header-wrap side-header-wrap">
        <router-link to="/">
          <svg-icon iconClass="back"></svg-icon>返回
        </router-link>
      </div>
      <div class="side-body-wrap"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {}
}
</script>

<style scoped>
.page {
  display: flex;
  cursor: default;
  .header-wrap {
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #0080eb;
    color: #fff;
    overflow: hidden;
    a {
      color: #fff;
      text-decoration: none;
      display: flex;
      align-items: center;
      padding: 0.3rem 0.8rem;
      border-radius: 1rem;
      transition: background-color .3s;
      .svg-icon {
        font-size: 1.2rem;
        margin-right: 0.3rem;
      }
      &:hover {
        background-color: #004781;
      }
    }
  }
  .side-wrap {
    width: 18rem;
    display: flex;
    flex-direction: column;
    &.side-left-wrap {
      .side-header-wrap {
        padding: 0 1rem;
        justify-content: start;
        font-size: 1.2rem;
        font-weight: bold;
        .svg-icon {
          font-size: 1.8rem;
          margin-right: 0.5rem;
        }
      }
      .side-body-wrap {
      }
    }
    &.side-right-wrap {
      .side-header-wrap {
        padding: 0 1rem;
        justify-content: end;
      }
      .side-body-wrap {
      }
    }
    .side-body-wrap {
      flex: 1;
    }
  }
  .main-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    .main-header-wrap {
      display: flex;
      flex-direction: column;
      justify-content: end;
      .main-header-inner {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
        color: #222;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        background-color: rgba(255,255,255, .7);
        .tools-bar {
          display: flex;
          align-items: center;
          &.center-tools-bar {
            height: 28px;
            background-color: #c00;
          }
        }
      }
    }
    .main-body-wrap {
      flex: 1;
      background-color: #e2edf6;
      border: 1px solid #b7cada;
      border-width: 0 1px;
    }
  }
}
</style>
