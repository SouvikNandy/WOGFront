import React from 'react';
import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';


export const createFloatingNotification = (type, title="title", message="message") => {
  
  switch (type) {
    case 'info':
      NotificationManager.info(message);
      return;
    case 'success':
      NotificationManager.success(message, title);
      return;
    case 'warning':
      NotificationManager.warning(message, title, 3000);
      return;
    case 'error':
      NotificationManager.error(message, title, 5000);
      return;
    default:
      NotificationManager.info(message);
      return;
  }
};





const createNotificationBtnClick = (type, title="title", message="message") => {
  
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info(message);
          break;
        case 'success':
          NotificationManager.success(message, title);
          break;
        case 'warning':
          NotificationManager.warning(message, title, 3000);
          break;
        case 'error':

          NotificationManager.error(message, title, 15000, () => {
            alert('callback');
          });
          break;
        default:
          NotificationManager.info(message);
          break;

      }
    };
  };

 
class Example extends React.Component {
  
 
  render() {
    return (
      <div>
        <button className='btn btn-info'
          onClick={createNotificationBtnClick('info')}>Info
        </button>
        <hr/>
        <button className='btn btn-success'
          onClick={createNotificationBtnClick('success')}>Success
        </button>
        <hr/>
        <button className='btn btn-warning'
          onClick={createNotificationBtnClick('warning')}>Warning
        </button>
        <hr/>
        <button className='btn btn-danger'
          onClick={createNotificationBtnClick('error')}>Error
        </button>
 
        {/* <NotificationContainer/> */}
      </div>
    );
  }
}
 
export default Example;