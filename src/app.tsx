// NAME: Autoplay
// AUTHOR: Ruxery (https://github.com/Ruxery/)
// DESCRIPTION: Automatically plays the last played song when you open Spotify.

export default async function AutoPlay() {
  if (!(!!Spicetify.LocalStorage && !!Spicetify.Menu)) {
    setTimeout(AutoPlay, 100)
    return
  }
  const name = "Autoplay: "
  const activeKey = "Extention:AutoPlay:active"
  var active: boolean = JSON.parse(Spicetify.LocalStorage.get(activeKey) as string) ?? true
  const showMessageKey = "Extention:AutoPlay:showMessage"
  var showMessage: boolean = JSON.parse(Spicetify.LocalStorage.get(showMessageKey) as string) ?? true
  registerMenu()
  main()

  function main() {
    if (!(!!Spicetify.Player && !!Spicetify.showNotification)) {
      setTimeout(main, 100)
      return
    }
    play()
  }

  function play() {
    if(active) {
      try {
        if(Spicetify.Player.isPlaying()) {
          notification("Song is already playing")
          return
        }
        Spicetify.Player.play()
        notification("Playing Last played song")
      } catch (error) {
        notification("" + error, true)
        console.error(name, error)
        setTimeout(play, 250)
      }
    } else {
      notification("deactivated")
    }
  }

  function notification(text: string, isError?: boolean) {
    if(!showMessage)
      return
    let time = 0
    for (let index = 0; index < 3; index++) {
      console.log(time)
      setTimeout(() => {
        Spicetify.showNotification(name + text, isError)  
        console.warn(name + text)
      }, time);
      time += 2500
    }
  }

  function registerMenu() {
    const activeMenu = new Spicetify.Menu.Item(
      "Use Autoplay", 
      active, 
      (menu: Spicetify.Menu.Item) => {
        active = !active
        menu.setState(active)
        Spicetify.LocalStorage.set(activeKey, JSON.stringify(active))
      }
    )
    const messageMenu = new Spicetify.Menu.Item(
      "show Information", 
      showMessage, 
      (menu: Spicetify.Menu.Item) => {
        showMessage = !showMessage
        menu.setState(showMessage)
        Spicetify.LocalStorage.set(showMessageKey, JSON.stringify(showMessage))
      }
    )
    new Spicetify.Menu.SubMenu("Autoplay", [activeMenu, messageMenu]).register();
  }
}
