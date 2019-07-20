import * as usb from 'usb';

(async () => {
  const nSwitch = usb.findByIds(0x057E, 8192);
  await nSwitch.open();

  const switchInterface = nSwitch.interfaces[0];
  // usb.LIBUSB_TRANSFER_TYPE_INTERRUPT;
  const switchInEndpoint = switchInterface.endpoint(129) as usb.InEndpoint;

  console.log(switchInEndpoint.descriptor);
  console.log(switchInEndpoint.direction);
  switchInEndpoint.transfer(1, (err, data) => {
    console.log(err);
    console.log(data);
  });
  switchInEndpoint.on("data", data => {
    console.log(data);
  })
})();

