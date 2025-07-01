// Quantumult X Resource Parser for Trojan Links

$httpClient.get($resource, function (error, response, data) {
  if (error) {
    $done({ error: "订阅获取失败：" + error });
    return;
  }

  const lines = data.split('\n').filter(line => line.startsWith('trojan://'));
  const nodes = [];

  lines.forEach((line, index) => {
    try {
      const url = new URL(line.trim());
      const host = url.hostname;
      const port = url.port || '443';
      const password = url.username;
      const params = new URLSearchParams(url.search);
      const sni = params.get('sni') || host;
      const name = decodeURIComponent(url.hash ? url.hash.substring(1) : `Trojan-${index + 1}`);
      const node = `trojan=${host}, ${port}, password=${password}, tls-verification=true, sni=${sni}, udp-relay=true, tag=${name}`;
      nodes.push(node);
    } catch (e) {}
  });

  $done({
    content: nodes.join('\n'),
    resource: $resource
  });
});
