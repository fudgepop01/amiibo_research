

struct memory {

}

struct GeneralPurposeRegister {
  memory: memory,
}

impl GeneralPurposeRegister {
  fn x(&mut self) -> memory {
    return self.memory;
  }

  fn w(&mut self) -> memory {
    return self.memory;
  }
}

struct Registers {
  r: [GeneralPurposeRegister; 30]
}
