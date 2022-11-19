// NAME: Startup Autoplay
// AUTHOR: Ruxery (https://github.com/Ruxery/)
// DESCRIPTION: Directly play the last played song after you open Spotify. Toggable in the Settings on the top right.

export default function AutoPlayOnStartup() {
  if (!(!!Spicetify.LocalStorage && !!Spicetify.Menu)) {
    setTimeout(AutoPlayOnStartup, 250)
    return
  }
  
  const name = "Autoplay: "
  const activeKey = "Extention:AutoPlay_On_Startup:active"
  var active: boolean = JSON.parse(Spicetify.LocalStorage.get(activeKey) as string) ?? true
  const showMessageKey = "Extention:AutoPlay_On_Startup:showMessage"
  var showMessage: boolean = JSON.parse(Spicetify.LocalStorage.get(showMessageKey) as string) ?? true
  registerMenu()
  main()

  function main() {
    if (!(!!Spicetify.Player && !!Spicetify.showNotification)) {
      setTimeout(main, 250)
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
        notification(name + error, true)
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
    Spicetify.showNotification(name + text, isError)
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
    new Spicetify.Menu.SubMenu("Startup Autoplay", [activeMenu, messageMenu]).register();
  }
}
