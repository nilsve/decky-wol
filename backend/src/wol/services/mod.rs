
#[derive(Clone)]
pub struct WolService {

}

impl WolService {
    pub fn new() -> Self {
        Self {}
    }

    pub async fn send_wol_packet(&self, mac_address: &str) -> Result<(), Box<dyn std::error::Error>> {
        // // Validate MAC address format
        let mac_address = if mac_address.len() == 17 {
            mac_address.replace(":", "").replace("-", "")
        } else if mac_address.len() == 12 {
            mac_address.to_string()
        } else {
            return Err("MAC address should be in the format AA:BB:CC:DD:EE:FF or AABBCCDDEEFF".into());
        };
        //
        // // Create a magic packet: 6x 0xFF followed by MAC address repeated 16 times
        // let mut magic_packet = vec![0xFF; 6];
        let mac_bytes = hex::decode(&mac_address)?;

        let mac_array: [u8; 6] = mac_bytes.try_into().expect("slice with incorrect length");

        let magic_packet = wake_on_lan::MagicPacket::new(&mac_array);

        // Send the magic packet via UDP to the broadcast address 255.255.255.255:9
        // from 0.0.0.0:0
        magic_packet.send()?;

        Ok(())
    }
}