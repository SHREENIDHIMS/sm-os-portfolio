import { useOS } from '../os/store'

export function Notifications() {
  const notifs = useOS((s) => s.notifs)
  if (notifs.length === 0) return null
  return (
    <>
      {notifs.map((n) => (
        <div key={n.id} className="notif">
          <div className="notif-title">{n.title}</div>
          <div className="notif-msg">{n.msg}</div>
        </div>
      ))}
    </>
  )
}