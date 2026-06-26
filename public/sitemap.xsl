<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; padding: 2rem; max-width: 900px; margin: 0 auto; color: #333; }
          h1 { font-size: 28px; margin-bottom: 0.5rem; color: #111; }
          p { margin-bottom: 2rem; color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          th, td { text-align: left; padding: 14px 20px; }
          th { background-color: #f8f9fa; font-weight: 600; color: #444; border-bottom: 2px solid #eaeaea; }
          td { border-bottom: 1px solid #eaeaea; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background-color: #f8f9fa; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; color: #004499; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This sitemap is intended for search engines like Google and Bing to discover the pages on this site.</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                </td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
