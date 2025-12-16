import buffer from "buffer";

if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = buffer.Buffer.allocUnsafeSlow ? buffer.Buffer.allocUnsafeSlow : (size) => buffer.Buffer.alloc(size);
    if (!buffer.SlowBuffer.prototype) {
        buffer.SlowBuffer.prototype = buffer.Buffer.prototype;
    }
}

if (!global.SlowBuffer) {
    global.SlowBuffer = buffer.SlowBuffer;
}
