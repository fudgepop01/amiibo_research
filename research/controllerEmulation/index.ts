import * as usb from 'usb';

(async () => {
  const device = usb.getDeviceList()[2];
  device.open();
  console.log(device);
})();