import Vue from "vue";
import VueRouter from "vue-router";
// import HomeView from '../views/HomeView.vue'
// import UserList from "../views/UserList.vue";
import RoomList from "../views/RoomList.vue";
import ChatBoard from "../views/ChatBoard.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/Signup.vue";
// import firebase from "@/firebase/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RoomList",
    component: RoomList,
    meta: { requiresAuth: true }, // 認証が必要なページの設定
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/chat",
    name: "ChatBoard",
    component: ChatBoard,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignUp,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// requiresAuthがtrueであればifの実装が行われる
// beroreEachでページを開くごとに認証が必要かどうかチェック
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((recode) => recode.meta.requiresAuth);
  // ログインされていればページ表示、されていなければログインしないとリダイレクト処理(ログインしている時だけ表示させたいページ設定)
  if (requiresAuth) {
    const user = sessionStorage.getItem("user");
    console.log(JSON.parse(user));
    if (!user) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }

    // firebase.auth().onAuthStateChanged((user) => {
    //   if (!user) {
    //     next({
    //       path: "/login",
    //       query: { redirect: to.fullPath },
    //     });
    //   } else {
    //     next();
    //   }
    // });
  } else {
    next(); // next() を常に呼び出すようにしてください!
  }
});

export default router;
