import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/stream',
    name: 'stream',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'stream_page',
        name: 'stream_page',
        meta: {
          icon: 'ios-camera',
          title: 'Monitor'
        },
        component: () => import('@/view/stream/stream.vue')
      }
    ]
  },

  {
    path: '/studies',
    name: 'studies',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'studies_page',
        name: 'studies_page',
        meta: {
          icon: 'ios-navigate',
          title: 'Annotate',
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/studies/studies.vue')
      }
    ]
  },

  {
    path: '/annotation',
    name: 'annotation_page',
    meta: {
      icon: 'ios-navigate',
      title: 'Annotation',
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'object_annotation_page',
        name: 'object_annotation_page',
        meta: {
          icon: 'ios-navigate',
          title: 'Object Detection Annotation'
        },
        component: () => import('@/view/annotation/objectAnnotation.vue')
      },
      {
        path: 'motion_study_page',
        name: 'motion_study_page',
        meta: {
          icon: 'ios-navigate',
          title: 'Motion Study'
        },
        component: () => import('@/view/annotation/motionStudy.vue')
      }
    ]
  },

  {
    path: '/train',
    name: 'train',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'train_page',
        name: 'train_page',
        meta: {
          icon: 'md-construct',
          title: 'Train'
        },
        component: () => import('@/view/train/train.vue')
      }
    ]
  },

  {
    path: '/data',
    name: 'data',
    meta: {
      icon: 'ios-stats',
      title: '数据导入导出'
    },
    component: Main,
    children: [
      {
        path: 'upload_data_page',
        name: 'upload_data_page',
        meta: {
          icon: 'md-add',
          title: '导入数据'
        },
        component: () => import('@/view/data/upload-data.vue')
      },
      {
        path: 'export_data_page',
        name: 'export_data_page',
        meta: {
          icon: 'md-download',
          title: '导出数据'
        },
        component: () => import('@/view/data/export-data.vue')
      }
    ]
  },

  {
    path: '/image_classification',
    name: '/image_classification',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'image_classification_page',
        name: 'image_classification_page',
        meta: {
          icon: 'ios-albums',
          title: '图像分类'
        },
        component: () => import('@/view/image-classification/image-classification.vue')
      }
    ]
  },
  {
    path: '/object-detection',
    name: 'object-detection',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'object_detection_page',
        name: 'object_detection_page',
        meta: {
          icon: 'ios-compass',
          title: 'detection'
        },
        component: () => import('@/view/object-detection/object-detection.vue')
      }
    ]
  },

  {
  path: '/analysis',
  name: 'analysis',
  meta: {
    hideInBread: true,
  },
  component: Main,
  children: [
    {
      path: 'analysis_page',
      name: 'analysis_page',
      meta: {
        icon: 'logo-buffer',
        title: 'analysis'
      },
      component: () => import('@/view/analysis/analysis.vue')
    }
  ]
},

{
  path: '/test',
  name: 'test',
  meta: {
    hideInBread: true
  },
  component: Main,
  children: [
    {
      path: 'test_page',
      name: 'test_page',
      meta: {
        icon: 'ios-camera',
        title: 'Test'
      },
      component: () => import('@/view/test/test.vue')
    }
  ]
},

{
  path: '/backup',
  name: 'backup',
  meta: {
    icon: 'ios-apps',
    title: '数据上传'
  },
  component: Main,
  children: [
    {
      path: 'backup1_page',
      name: 'backup1_page',
      meta: {
        icon: 'md-clipboard',
        title: 'Backup page1'
      },
      component: () => import('@/view/backup/backup1.vue')
    },
    {
      path: 'backup2_page',
      name: 'backup2_page',
      meta: {
        icon: 'md-clipboard',
        title: 'Backup page2'
      },
      component: () => import('@/view/backup/backup2.vue')
    }
  ]
},

  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
