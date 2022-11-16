var startupDautoplay = (() => {
  // src/app.tsx
  function AutoPlayOnStartup() {
    var _a, _b;
    if (!(Spicetify == null ? void 0 : Spicetify.LocalStorage) || !Spicetify.Menu) {
      setTimeout(AutoPlayOnStartup, 250);
      return;
    }
    const name = "Autoplay: ";
    const activeKey = "Extention:AutoPlay_On_Startup:active";
    var active = (_a = JSON.parse(Spicetify.LocalStorage.get(activeKey))) != null ? _a : true;
    const showMessageKey = "Extention:AutoPlay_On_Startup:showMessage";
    var showMessage = (_b = JSON.parse(Spicetify.LocalStorage.get(showMessageKey))) != null ? _b : true;
    registerMenu();
    main();
    function main() {
      if (!Spicetify.Player || !Spicetify.showNotification) {
        setTimeout(main, 250);
        return;
      }
      play();
    }
    function play() {
      if (active) {
        try {
          if (Spicetify.Player.isPlaying()) {
            notification("Song is already playing");
            return;
          }
          Spicetify.Player.play();
          notification("Playing Last played song");
        } catch (error) {
          notification("" + error, true);
          console.error(name, error);
          setTimeout(play, 100);
        }
      } else {
        notification("deactivated");
      }
    }
    function notification(text, isError) {
      if (showMessage)
        Spicetify.showNotification(name + text, isError);
    }
    function registerMenu() {
      const activeMenu = new Spicetify.Menu.Item(
        "Use Autoplay",
        active,
        (menu) => {
          active = !active;
          menu.setState(active);
          localStorage.setItem(activeKey, JSON.stringify(active));
          Spicetify.LocalStorage.set(activeKey, JSON.stringify(active));
        }
      );
      const messageMenu = new Spicetify.Menu.Item(
        "show Information",
        showMessage,
        (menu) => {
          showMessage = !showMessage;
          menu.setState(showMessage);
          Spicetify.LocalStorage.set(showMessageKey, JSON.stringify(showMessage));
        }
      );
      new Spicetify.Menu.SubMenu("Startup Autoplay", [activeMenu, messageMenu]).register();
    }
  }

  // node_modules/spicetify-creator/dist/temp/index.jsx
  (async () => {
    await AutoPlayOnStartup();
  })();
})();
