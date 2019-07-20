extern crate libusb;

use std::time::Duration;

fn use_device(dev: libusb::Device) {
  let mut opened: libusb::DeviceHandle = dev.open().unwrap();

  match opened.claim_interface(0) {
    Ok(()) => println!("opened"),
    Err(e) => println!("error claiming device: {}", e)
  }

  let mut buf: [u8; 0xFF] = [0; 0xFF];
  match opened.read_interrupt(
    1,
    &mut buf,
    Duration::new(10, 0)
  ) {
    Ok(n) => println!("read {} bytes", n),
    Err(e) => println!("error reading interrupt: {}", e)
  }

  for byte in buf.iter() {
    print!("{}", byte);
  }

  // for interface in dev.active_config_descriptor().unwrap().interfaces() {
  //   for descriptor in interface.descriptors() {
  //     println!("{:?}", descriptor);
  //   }
  // }
}

fn main() {
  let context = libusb::Context::new().unwrap();

  let mut dev: Option<libusb::Device> = None;
  for device in context.devices().unwrap().iter() {
      let device_desc = device.device_descriptor().unwrap();

      if device_desc.vendor_id() == 0x57e {
        dev = Some(device);
      }
  }
  if let Some(d) = dev {
    use_device(d)
  } else {
    println!("turn on the switch, dummy");
  }
}