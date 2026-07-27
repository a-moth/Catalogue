<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet 
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output 
        method="html"
        encoding="UTF-8"
        indent="yes"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>XML Data Catalogue</title>
                <link rel="stylesheet" href="index.css" />
            </head>

            <body>
                <h1>Catalogue</h1>

                <!-- Search function in bar-->
                <!-- Sorting template for categories-->
                <!-- Sorting template for tags -->

                <xsl:apply-templates select="catalog/entries/entry"/>

            </body>
        </html>
    </xsl:template>


    <xsl:template match="entry">

        <article>
            <h2>
                <xsl:value-of select="title"/>
            </h2>
            <p>
                Created: <xsl:value-of select="metadata/created"/><br/>
                <xsl:for-each select="link">
                    Link (<xsl:value-of select="position()"></xsl:value-of>): <a href="{href}">
                        <xsl:value-of select="title"/>
                    </a>
                </xsl:for-each>
            </p>
            <div>
                <p>
                    <xsl:for-each select="categories/category">
                        <xsl:if test="position() = 1">
                            Categories<br/>
                        </xsl:if>
                        <xsl:value-of select="name" />
                        <xsl:if test="position() != last()">
                            <xsl:text>, </xsl:text>
                        </xsl:if>
                    </xsl:for-each>
                </p>
                <p>
                    <xsl:value-of select="description"/>
                </p>
                <div class="carousel">
                    <div class="slides">
                        <xsl:for-each select="image">
                            <figure
                                class="slide"
                                id="{concat(generate-id(..), '-', position())}">
                                <a class="previous">
                                    <xsl:attribute name="href">
                                        <xsl:text>#</xsl:text>
                                        <xsl:choose>
                                            <xsl:when test="position() &gt; 1">
                                                <xsl:value-of select="concat(generate-id(..), '-', position() - 1)"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(generate-id(..), '-', last())"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:attribute>
                                    &lt;
                                </a>
                                <img
                                    class="carousel-image"
                                    src="{href}"
                                    width="{width}"
                                    height="{height}"
                                    alt="{title}"/>
                                <figcaption>
                                    <xsl:value-of select="title"/>
                                </figcaption>
                                <a class="next">
                                    <xsl:attribute name="href">
                                        <xsl:text>#</xsl:text>
                                        <xsl:choose>
                                            <xsl:when test="position() &lt; last()">
                                                <xsl:value-of select="concat(generate-id(..), '-', position() + 1)"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat(generate-id(..), '-', 1)"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:attribute>
                                    &gt;
                                </a>
                            </figure>
                        </xsl:for-each>
                    </div>
                </div>
            </div>
        </article>
    </xsl:template>
</xsl:stylesheet>