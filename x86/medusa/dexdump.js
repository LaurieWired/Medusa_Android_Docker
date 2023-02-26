/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/1/7 20:44
* */


var enable_deep_search = true;

function verify_by_maps(dexptr, mapsptr) {
    var maps_offset = dexptr.add(0x34).readUInt();
    var maps_size = mapsptr.readUInt();
    for (var i = 0; i < maps_size; i++) {
        var item_type = mapsptr.add(4 + i * 0xC).readU16();
        if (item_type === 4096) {
            var map_offset = mapsptr.add(4 + i * 0xC + 8).readUInt();
            if (maps_offset === map_offset) {
                return true;
            }
        }
    }
    return false;
}

function verify(dexptr, range, enable_verify_maps) {

    if (range != null) {
        var range_end = range.base.add(range.size);
        // verify header_size
        if (dexptr.add(0x70) > range_end) {
            return false;
        }

        // verify file_size
        var dex_size = dexptr.add(0x20).readUInt();
        if (dexptr.add(dex_size) > range_end) {
            return false;
        }

        if (enable_verify_maps) {
            var maps_offset = dexptr.add(0x34).readUInt();
            if (maps_offset === 0) {
                return false
            }

            var maps_address = dexptr.add(maps_offset);
            if (maps_address > range_end) {
                return false
            }

            var maps_size = maps_address.readUInt();
            if (maps_size < 2 || maps_size > 50) {
                return false
            }
            var maps_end = maps_address.add(maps_size * 0xC + 4);
            if (maps_end < range.base || maps_end > range_end) {
                return false
            }
            return verify_by_maps(dexptr, maps_address)
        } else {
            return dexptr.add(0x3C).readUInt() === 0x70;
        }
    }


}

rpc.exports = {
    memorydump: function memorydump(address, size) {
        return new NativePointer(address).readByteArray(size);
    },
    switchmode: function switchmode(bool){
        enable_deep_search = bool;
    },
    scandex: function scandex() {
        var result = [];
        Process.enumerateRanges('r--').forEach(function (range) {
            try {
                Memory.scanSync(range.base, range.size, "64 65 78 0a 30 ?? ?? 00").forEach(function (match) {

                    if (range.file && range.file.path
                        && (// range.file.path.startsWith("/data/app/") ||
                            range.file.path.startsWith("/data/dalvik-cache/") ||
                            range.file.path.startsWith("/system/"))) {
                        return;
                    }

                    if (verify(match.address, range, false)) {
                        var dex_size = match.address.add(0x20).readUInt();
                        result.push({
                            "addr": match.address,
                            "size": dex_size
                        });
                    }
                });

                if (enable_deep_search) {
                    Memory.scanSync(range.base, range.size, "70 00 00 00").forEach(function (match) {
                        var dex_base = match.address.sub(0x3C);
                        if (dex_base < range.base) {
                            return
                        }
                        if (dex_base.readCString(4) != "dex\n" && verify(dex_base, range, true)) {
                            var dex_size = dex_base.add(0x20).readUInt();
                            result.push({
                                "addr": dex_base,
                                "size": dex_size
                            });
                        }
                    })
                } else {
                    if (range.base.readCString(4) != "dex\n" && verify(range.base, range, true)) {
                        var dex_size = range.base.add(0x20).readUInt();
                        result.push({
                            "addr": range.base,
                            "size": dex_size
                        });
                    }
                }

            } catch (e) {
            }
        });

        return result;
    }
};