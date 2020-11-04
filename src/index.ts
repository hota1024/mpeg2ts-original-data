import sophy from 'sophy'
import { BitStream, BitView } from 'bit-buffer'

const PACKET_SIZE = 188

function createPacket(pid: number, payload: Buffer): Buffer {
  const buffer = new ArrayBuffer(PACKET_SIZE)
  const view = new BitView(buffer)
  const stream = new BitStream(view)

  stream['bigEndian'] = true

  view.setBits(0, 0x47, 8)
  view.setBits(8, 0b0, 1)
  view.setBits(9, 0b1, 1)
  view.setBits(10, 0b0, 1)
  view.setBits(11, pid, 13)

  return view.buffer
}

const packet = createPacket(18, Buffer.from('hello, world'))
sophy.write('./out/test.ts', packet.toString())
