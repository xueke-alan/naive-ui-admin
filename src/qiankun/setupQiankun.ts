import { useDesignSettingStore } from '@/store/modules/designSetting';
import { registerMicroApps } from 'qiankun';

// import { http } from '@/utils/http/axios';

//获取主控台信息

// 这里需要在乾坤容器所在的vue文件中挂载前执行，否则会因为没有容器而无法成功注册
export async function setupQiankun() {
  const qiankunRouter2: Array<any> = [];
  await import('@/router').then((router) => {
    const routerList = router.default.getRoutes();
    routerList.forEach((c) => {
      if (c.meta?.isQiankunRouter) {
        console.log(c.meta.isQiankunRouter['entry']);
        qiankunRouter2.push(c.meta.isQiankunRouter);
      }
    });
  });

  // 这里是获取子路由信息，
  // TODO 这里需要修改代码，以确保单个微服务宕机后其他微服务仍然可以正常注册

  // TODO 这里需要添加功能，当微服务重新联机后，需要注册应用
  const designStore = useDesignSettingStore();

  qiankunRouter2.forEach((q) => {
    q.props = {
      globalStateList: { designStore },
      // TODO 为了尽可能保证页面统一，日后一定会使用其他的UI组件库，这个时候需要考虑模态框，通知，loading等全局的组件样式统一，需要下放这些方法
      message: () => {
        console.log('base');
      },
      // TODO 子应用加载完毕后才关闭遮罩
    };
  });

  console.log(qiankunRouter2);
  // function sleep(time) {
  //   return new Promise(function (resolve) {
  //     setTimeout(resolve, time);
  //   });
  // }
  // await sleep(800);
  registerMicroApps(qiankunRouter2, {
    beforeLoad: [
      (currentApp) => {
        console.log('before load', currentApp);
        return Promise.resolve();
      },
    ], // 挂载前回调
    beforeMount: [
      (currentApp) => {
        console.log('before mount', currentApp);
        const main_view_qiankun_contener_classList = document.querySelector(
          '#main-view-qiankun-contener'
        )?.classList;
        if (main_view_qiankun_contener_classList) {
          main_view_qiankun_contener_classList.remove('fadeIn');
          setTimeout(() => {
            main_view_qiankun_contener_classList.add('fadeIn');
            console.log(main_view_qiankun_contener_classList);
          }, 0);
        }

        return Promise.resolve();
      },
    ],
    // 挂载后回调
    afterUnmount: [
      (currentApp, a) => {
        const name = currentApp.name;
        console.log('after unload', currentApp, a[name]);
        return Promise.resolve();
      },
    ],
  });
}
