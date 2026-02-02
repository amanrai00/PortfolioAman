import { createRouter, createWebHistory } from "vue-router";

const scrollToTarget = (target) =>
  new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 200;
    const tryScroll = () => {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        resolve(true);
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) {
        resolve(false);
        return;
      }
      window.setTimeout(tryScroll, 50);
    };
    tryScroll();
  });

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/HomePage.vue"),
    },
    {
      path: "/projects/progress",
      name: "project-progress",
      component: () => import("@/pages/ProjectDetail.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    const hashTarget = to.hash && to.hash.length > 1 ? to.hash : null;
    const section = Array.isArray(to.query.section) ? to.query.section[0] : to.query.section;
    const target = hashTarget || (section ? `#${section}` : null);
    if (target) {
      return scrollToTarget(target).then((didScroll) => (didScroll ? false : false));
    }
    return { top: 0 };
  },
});

router.afterEach((to) => {
  const hashTarget = to.hash && to.hash.length > 1 ? to.hash : null;
  const section = Array.isArray(to.query.section) ? to.query.section[0] : to.query.section;
  const target = hashTarget || (section ? `#${section}` : null);
  if (!target) return;
  // Extra guard in case the view renders late or a transition delays layout.
  window.setTimeout(() => {
    scrollToTarget(target);
  }, 150);
});

export default router;
