function serialize(obj) {
    var str = [];
    for (var p in obj)
      if (typeof obj[p] === 'object' && obj[p] !== null) {
          if (obj[p].addOnlyProperty) {
              str.push(p)
          }
      }
      else if (obj[p] && obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  export default {
    serialize
  }