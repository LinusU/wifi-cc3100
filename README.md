# wifi-cc3100

Node.js module for connecting CC3100 to the Tessel.

I have started to look at getting the CC3100 to work with the tessel. This is the next version of the wlan chip currently used in the tessel. Improvements over the current chip would be 802.11n support, more concurrent sockets, higher throughput and less buggy.

## Hardware

Connecting the CC3100 to the tessel is easiest done with the CC3100BOOST, which is a small breakout board for the actual chip. Hooking it up to the tessel is as easy as connecting 7 cables. You can use any port on the tessel for this, since they all share the same SPI channel.

![Visualization](/doc/tessel-cc3100boost.jpg?raw=true)

| Name | Tessel | CC3100BOOST | Description             |
|------|--------|-------------|-------------------------|
| GND  | 1      | 3.2         | Ground                  |
|      |        |             |                         |
| SCK  | 5      | 1.7         | SPI Clock               |
| MISO | 6      | 2.7         | SPI master in/slave out |
| MOSI | 7      | 2.6         | SPI master out/slave in |
| CS   | 8      | 2.3         | SPI Chip Select         |
| IRQ  | 9      | 2.2         | Interrupt request       |
| nHIB | 10     | 1.5         | Hibernate               |
|      |        |             |                         |

## Software

The source code for the software is available in a GitHub repo at https://github.com/LinusU/wifi-cc3100. Easiest to get started is to clone the repo and run the test-file included. It has the port hard-coded to `B` so either use that or edit `test.js`.

```bash
git clone http://github.com/LinusU/wifi-cc3100.git
cd wifi-cc3100
tessel run test.js
```

It will print out a lot of debugging info and hopefully also print out `Ready!` which indicates that the board was reseted and initialised. The test code will right now try to connect to a unsecured network called `FlatRoof`, just because that is my setup.

## Hacking

To get started with development of the module just start by editing `test.js` to include what you want to test. Then edit `index.js` to add the implementation. The implementation of the messages is inside `lib/msg.js`, it implements serialising and deserialising to the wire. The protocol is implemented in `lib/protocol.js` and can be used to send a message to the chip, and then wait for response.

`index.js` has top level methods that packs together a message and sends it via the protocol. The main method here is `protocol.send(opcode, descriptors, payload, cb)`. `opcode`, `descriptors` and `payload` are described on the TI Wiki, see `Protocol description` below. `cb` is a callback that will be called once the chip answers.

I recommend downloading the SDK to see exactly what `descriptors` and `payload` should contain. The name of the function corresponds to the messages, search their driver source code.

## Links

 - [Protocol description](http://processors.wiki.ti.com/index.php/Staging:CC3100_%26_CC3200_Protocol) - Look here for what messages to send to the chip.
 - [CC3100 API](http://software-dl.ti.com/ecs/cc31xx/APIs/public/cc32xx_simplelink/latest/html/index.html) - Look here for more info on the messages.
 - [CC3100 SDK](http://www.ti.com/tool/cc3100sdk) - Look here for the exact data to send in the messages.
