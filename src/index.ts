import sophy from 'sophy'
import { BitStream, BitView } from 'bit-buffer'

const PACKET_SIZE = 188
const PACKET_HEADER_SIZE = 4

function createPacket(pid: number, counter: number, payload: Buffer): Buffer {
  const buffer = new ArrayBuffer(PACKET_SIZE)
  const view = new BitView(buffer)
  const stream = new BitStream(view)

  stream['bigEndian'] = true // no definition... :(

  view.setBits(0, 0x47, 8) // sync byte

  view.setBits(8, 0b0, 1) // TEI
  view.setBits(9, 0b1, 1) // PUSI
  view.setBits(10, 0b0, 1) // transport priority
  view.setBits(11, pid, 13) // PID

  view.setBits(24, 0b00, 2) // TSC
  view.setBits(26, 0b00, 0b01) // adaptation field control(0b01 = pyaload)
  view.setBits(28, counter % 16, 4) // continuity counter

  payload.forEach((byte, index) => {
    console.log(byte.toString(16))
    view.setBits(PACKET_HEADER_SIZE * 8 + index * 8, byte, 8)
  })

  return view.buffer
}

const packets = [
  createPacket(0x400, 0, Buffer.from('hello, world')),
  createPacket(0x400, 1, Buffer.from('this is a test')),
]
sophy.write(
  './out/test.ts',
  packets.map((packet) => packet.toString()).join('')
)
