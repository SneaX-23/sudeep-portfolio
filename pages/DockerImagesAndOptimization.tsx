import React from 'react';
import { 
  BlogLayout, 
  Breadcrumb, 
  ArticleHeader, 
  P, 
  H2, 
  H3,
  Strong, 
  ItalicStrong, 
  Divider, 
  InlineCode, 
  CodeBlock, 
  Syntax,
  Img
} from '../components/BlogTemplate';

export default function DockerImagesAndOptimization() {
  return (
    <BlogLayout authorName="Sudeep Magadum">
      <ArticleHeader 
        title="Docker Images And Image Optimization"
        date="2026-02-28"
      />
      <Img
        src="/blogs/dockerImagesAndOptimization/meme2vs1.jpg"
        alt="Docker meme"
        className="max-w-2xl" 
      />
      <article>
        <Divider />
        <H3>Before diving into image Optimization lets talk about what are docker images and why image size matters</H3>
        <P>A Docker image is an immutable, standalone, executable package that contains everything needed to run an application; code, runtime, system tools, libraries, and settings. It acts as a read-only template or blueprint used to create Docker containers.</P>
        
        <P><Strong>Why image size matters</Strong></P>
        <P>Larger images increase build times because more data must be processed, especially when the build context is large or unnecessary files are included. You have to wait for minutes for the build to complete.</P>

        <P>If your image size is very large (e.g. 5GB+) you may even have to wait 45+ minutes for your image to deploy over the internet to a remote server.</P>

        <P>Large Docker image size increases security risks by expanding the attack surface. Bloated images often include unnecessary tools, libraries, and package managers (e.g. curl, bash, apt, gcc) that are not required for runtime but can be exploited by attackers.</P>

        <P>With smaller image sizes you will have fewer packages to maintain and fewer vulnerabilities to deal with.</P>

        <P>These are just some examples of why image size matters.</P>
        
        <Divider />

        <P>This blog is primarily intended for beginners.</P>
        <P>By the end of this blog, you will:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- Understand what Docker images are and how they are structured</p>
          <p>- Learn how image layers work and how they impact size</p>
          <p>- Identify common causes of Docker image bloat</p>
          <p>- Apply practical techniques to reduce image size</p>
          <p>- Use tools to analyze, detect, and fix oversized images</p>
        </div>

        <Divider/>

        <H2>Docker Images</H2>
        <P>Lets talk in-depth about docker images, here's a more technical definition of a docker image:</P>
        <CodeBlock>
          <Syntax.String>A Docker image is a read-only template composed of a stack of file system layers, each layer representing a file system diff, combined via a union file system (UnionFS) and identified by a cryptographic content digest (SHA256).</Syntax.String>
        </CodeBlock>
        <P>As stated in the definition, a docker image is composed of file system layers. What does layer mean here? Each layer is a Dockerfile instruction or rather the file system diff from the previous layer.</P>
        <CodeBlock>
          <ItalicStrong>Note: </ItalicStrong>
          A layer is not the Dockerfile instruction itself, it is the file system change produced by that instruction.
        </CodeBlock>

        <H3>Instructions That Create File System Layers</H3>
        <P>These instructions write actual data to the file system and produce a new layer with real size:</P>
        <CodeBlock>
          <P><Syntax.Keyword>FROM</Syntax.Keyword> Adds the base layer</P>
          <P><Syntax.Keyword>RUN</Syntax.Keyword> Executes a command; any filesystem changes become a new layer</P>
          <P><Syntax.Keyword>COPY</Syntax.Keyword> Copies files from the build context into the image</P>
          <P><Syntax.Keyword>ADD</Syntax.Keyword> Like <InlineCode>COPY</InlineCode> but supports URLs and auto-extraction of archives</P>
        </CodeBlock>
        <P>We will not discuss Dockerfiles in depth, it is outside the scope of this blog. You can read more about them <a href="https://docs.docker.com/reference/dockerfile/" className="text-[#569cd6] hover:underline"><ItalicStrong>here.</ItalicStrong></a></P>
        
        <P>Once a layer of a Docker image is created, its contents cannot be modified in place. Any change results in the creation of a new layer rather than alteration of an existing one. Since each layer is the file system diff, that's why the order of Dockerfile instructions is important, we will discuss why later in the blog.</P>

        <H3>Layer Example</H3>
        <CodeBlock>
          <P><Syntax.Keyword>FROM </Syntax.Keyword><Syntax.Type>alpine:3.19</Syntax.Type>  <Syntax.Comment># Base Image Layer</Syntax.Comment></P>
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword><Syntax.Type>/app</Syntax.Type>  <Syntax.Comment># Metadata only</Syntax.Comment></P>
          <P><Syntax.Keyword>COPY </Syntax.Keyword><Syntax.Type>main .</Syntax.Type>  <Syntax.Comment># Filesystem layer — adds 'main' binary</Syntax.Comment></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword><Syntax.Type>chmod +x main</Syntax.Type>  <Syntax.Comment># Filesystem layer — permission change recorded</Syntax.Comment></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type>["./main"]</Syntax.Type>  <Syntax.Comment># Metadata layer — no filesystem changes</Syntax.Comment></P>
        </CodeBlock>

        <P>
          When we run <InlineCode>docker build</InlineCode>, Docker executes each instruction in the Dockerfile (FROM, RUN, COPY, etc.) in sequence. Every instruction produces a file system diff, which is committed as a new read-only layer. These layers are content-addressed (SHA256 digest) and cached, allowing Docker to reuse unchanged layers in subsequent builds.
        </P>
        <P>During the build process, Docker does not physically merge these layers into a single file system. Instead, it records them as a stacked sequence of immutable layers, along with metadata describing their order and relationships.</P>
        <P>The logical combination of these layers happens at runtime, not at build time.</P>
        <P>When we run:</P>
        <CodeBlock>docker run &lt;image&gt;</CodeBlock>

        <P>Docker uses a union file system (commonly OverlayFS on Linux) to overlay all the image’s read-only layers and present them as a single unified root file system to the container. At this point, Docker also adds a new writable container layer on top.</P>
        <P>A container is simply a running instance of an image, but with one important addition: its own private writable layer.</P>
        <P>All image layers remain shared and read-only. If you run multiple containers from the same image:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- The underlying image layers exist only once on disk.</p>
          <p>- All containers reference the same read-only layers.</p>
          <p>- Each container gets its own independent writable layer.</p>
        </div>

        <P>This design enables:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- Efficient disk usage (no duplication of image layers)</p>
          <p>- Fast container startup</p>
          <p>- Strong layer caching during builds</p>
          <p>- Copy-on-write semantics for runtime changes</p>
        </div>

        <P>When a container modifies a file, Docker performs a copy-on-write operation:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- The file is copied from the read-only image layer into the container’s writable layer.</p>
          <p>- The modification occurs only in that writable layer.</p>
          <p>- The original image remains unchanged.</p>
        </div>
        
        <P>This layered architecture is the fundamental reason Docker images are lightweight, reusable, and efficient at scale.</P>
        <P>Docker layer caching is not limited to local builds, it also works at the registry level. Container registries store image layers using content-addressable digests (SHA256). When you push an image, Docker checks whether each layer already exists in the registry, if a layer with the same digest is present, it is not uploaded again. Similarly, during a pull, Docker downloads only the layers that are missing locally. This de-duplication mechanism ensures efficient storage usage and significantly reduces push and pull times, especially when multiple images share common base layers.</P>
        <P>Now that we understand how Docker images are structured and how layers work, we can analyze what actually increases image size. Since each file system change becomes a layer and layers are immutable, inefficient Dockerfile patterns can quickly lead to image bloat.</P>

        <Divider />

        <H2>Docker Image Optimization</H2>
        <P>Lets consider the below naive and unoptimized Dockerfile we will be optimizing through out the rest of the blog.</P>
        <CodeBlock>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>ubuntu:22.04</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Comment># Install Node manually without cleanup</Syntax.Comment></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>apt update</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>apt install -y curl gnupg</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>curl -fsSL https://deb.nodesource.com/setup_24.x | bash -</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>apt install -y nodejs</Syntax.Type></P>
          <br />
          <P><Syntax.Comment># Copy entire project at once</Syntax.Comment></P>
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <br />
          <P><Syntax.Comment># Install all dependencies (including dev)</Syntax.Comment></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm install</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword> <Syntax.Type>3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword> <Syntax.Type>["npm", "start"]</Syntax.Type></P>
        </CodeBlock>

        <P>This Dockerfile starts from an Ubuntu base image, manually installs Node.js and required system packages, then copies the entire project and installs all dependencies (including dev dependencies). It builds the application inside the same image and runs it with <InlineCode>npm start</InlineCode>, leaving build tools and unnecessary packages in the final image.</P>

        <P>Now lets build the image and see the image size. We will execute the below command to build our image.</P>
        <CodeBlock>docker build -t node-app:v1 .</CodeBlock>
          
        <P>This tells Docker to:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- Read a Dockerfile</p>
          <p>- Execute its instructions step by step</p>
          <p>- Produce a new image</p>
        </div>

        <P>The <InlineCode>-t</InlineCode> flag means tag. It assigns a name and version to the image in this format:</P>
        <P><InlineCode>repository:tag</InlineCode></P>

        <P>So here:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- Repository name: node-app</p>
          <p>- Tag (version): v1</p>
        </div>
        <P>Without a tag, Docker defaults to <InlineCode>latest</InlineCode>.</P>

        <P>The dot means: <Strong>Use the current directory as the build context.</Strong></P>

        <P>The build context includes:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- The Dockerfile</p>
          <p>- Application source code</p>
          <p>- Any files referenced by <InlineCode>COPY</InlineCode> or <InlineCode>ADD</InlineCode></p>
        </div>

        <P>Docker sends this entire directory to the Docker daemon.</P>
        <P>This is the image size we get with our unoptimized Dockerfile:</P>

        <Img
          src="/blogs/dockerImagesAndOptimization/image_ver_1.png"
          alt="Docker image size version 1"
          className="max-w-2xl" 
        />

        <P><Strong>Disk Usage</Strong> represents the total storage footprint on our local drive, including the heavy base operating system and all inherited shared layers. <Strong>Content Size</Strong> isolates the actual weight of our application code, binaries, and specific dependencies added during our build. While the app content is only 163MB, the full image occupies 637MB because it carries the overhead of a large base distribution.</P>
        
        <P>Now lets run <InlineCode>docker history node-app:v1</InlineCode> to see layer sizes.</P>
        
        <Img
          src="/blogs/dockerImagesAndOptimization/history_version_1.png"
          alt="Docker history version 1"
          className="max-w-2xl"
        />

        <P>By running <InlineCode>docker history</InlineCode>, we can see exactly where our 637MB went. Each instruction creates a layer: our base OS takes up 85MB, but the real reason is the 233MB spent on the Node.js installation and 73MB on an <InlineCode>apt update</InlineCode>. These layers are immutable, meaning even if we deleted the cache in a later step, the initial 'heavy' layer remains part of the total disk usage.</P>
        
        <P>Since we know each <InlineCode>RUN</InlineCode> creates a layer, lets combine the <InlineCode>apt</InlineCode> command and clean up the package cache.</P>
        
        <P>Here's the updated docker file:</P>
        <CodeBlock>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>ubuntu:22.04</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P>
            <Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>apt update && \</Syntax.Type><br />
            <Syntax.Type>    apt install -y curl gnupg && \</Syntax.Type><br />
            <Syntax.Type>    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \</Syntax.Type><br />
            <Syntax.Type>    apt install -y nodejs && \</Syntax.Type><br />
            <Syntax.Type>    rm -rf /var/lib/apt/lists/*</Syntax.Type>
          </P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm install </Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword><Syntax.Type> 3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type> ["npm", "start"] </Syntax.Type></P>
        </CodeBlock>

        <P>This step combines all package installation commands into a single <InlineCode>RUN</InlineCode> instruction to prevent unnecessary image layers. We install required system packages, add the NodeSource repository to get the desired Node.js version, and then install Node.js itself. Finally, we remove the APT package index (<InlineCode>/var/lib/apt/lists</InlineCode>) in the same layer to prevent cached metadata from increasing the final image size.</P>
        
        <P>Now let's see the size of the image now. I will run the following command same as the previous one but with a different version tag:</P>
        <CodeBlock>docker build -t node-app:v2 .</CodeBlock>
        
        <Img
          src="/blogs/dockerImagesAndOptimization/image_ver_2.png"
          alt="Docker image size version 2"
          className="max-w-2xl"
        />
        <Img
          src="/blogs/dockerImagesAndOptimization/history_version_2.png"
          alt="Docker history version 2"
          className="max-w-2xl"
        />

        <P>Just by combining the <InlineCode>apt</InlineCode> commands and cleaning up the package cache we got an image which is <Strong>125MB</Strong> smaller.</P>

        <P>In this step, we optimize build caching by copying dependency definition files before copying the entire project source code. For Node.js, this means copying <InlineCode>package.json</InlineCode> and <InlineCode>package-lock.json</InlineCode>, for Go, <InlineCode>go.mod</InlineCode> and <InlineCode>go.sum</InlineCode>; and similarly, dependency manifest files for other languages.</P>

        <P>Here's the updated docker file:</P>
        <CodeBlock>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>ubuntu:22.04</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P>
            <Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>apt update && \</Syntax.Type><br />
            <Syntax.Type>    apt install -y curl gnupg && \</Syntax.Type><br />
            <Syntax.Type>    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \</Syntax.Type><br />
            <Syntax.Type>    apt install -y nodejs && \</Syntax.Type><br />
            <Syntax.Type>    rm -rf /var/lib/apt/lists/*</Syntax.Type>
          </P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword><Syntax.Type> 3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type> ["npm", "start"] </Syntax.Type></P>
        </CodeBlock>

        <P>Docker caches layers based on file changes. If we copy the full project before installing dependencies, any small code change invalidates the cache and forces dependencies to reinstall. By copying only dependency files first and running the install step, Docker can reuse the cached dependency layer as long as those files do not change.</P>

        <P>We combine this with a <InlineCode>.dockerignore</InlineCode> file, which works similarly to <InlineCode>.gitignore</InlineCode>. It prevents unnecessary files (such as <InlineCode>.git</InlineCode>, <InlineCode>node_modules</InlineCode>, logs, and local artifacts) from being sent to the Docker build context, reducing image size and improving build performance.</P>

        <P>Here's the <InlineCode>.dockerignore</InlineCode> file:</P>
        <CodeBlock>
          node_modules<br />
          .git<br />
          .gitignore<br />
          .env<br />
          Dockerfile<br />
          docker-compose.yml<br />
          npm-debug.log<br />
          dist<br />
          coverage
        </CodeBlock>

        <P><InlineCode>.dockerignore</InlineCode> reduces the build context size. Docker sends the entire build context to the daemon before building, so excluding unnecessary files improves build speed and prevents accidental image bloat.</P>

        <P>Updated docker sizes:</P>
        <Img
          src="/blogs/dockerImagesAndOptimization/image_ver_3.png"
          alt="Docker image size version 3"
          className="max-w-2xl"
        />
        <Img
          src="/blogs/dockerImagesAndOptimization/history_version_3.png"
          alt="Docker history version 3"
          className="max-w-2xl"
        />

        <P>At this stage, the image size did not significantly decrease and it even increased slightly. This is expected. Reordering the dependency installation improves Docker’s layer caching, which speeds up rebuilds when application code changes.</P>

        <P>When we change our application code without adding or removing dependencies, Docker can reuse the cached layer where <InlineCode>npm ci</InlineCode> was executed, because the <InlineCode>package*.json</InlineCode> files remain unchanged. As a result, only the source code layer is rebuilt, and dependencies are not reinstalled. This significantly reduces build time, even though the overall image size remains mostly the same.</P>

        <P>So far, we optimized build caching but kept the <Strong>Ubuntu</Strong> base image, which still adds unnecessary system overhead. Instead of manually installing Node.js on top of Ubuntu, we can switch to a minimal official Node image. Using an Alpine-based Node image removes the need for manual package installation and significantly reduces the final image size.</P>

        <P>Updated Dockerfile (using alpine):</P>
        <CodeBlock>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>node:24-alpine</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword><Syntax.Type> 3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type> ["node", "app.js"] </Syntax.Type></P>
        </CodeBlock>

        <Img
          src="/blogs/dockerImagesAndOptimization/image_ver_4.png"
          alt="Docker image size version 4"
          className="max-w-2xl"
        />
        <Img
          src="/blogs/dockerImagesAndOptimization/history_version_4.png"
          alt="Docker history version 4"
          className="max-w-2xl"
        />

        <P>Switching from Ubuntu to <InlineCode>node:24-alpine</InlineCode> significantly reduced the image size because Alpine is a minimal distribution designed specifically for containers. Unlike Ubuntu, which includes a full glibc-based userland and package ecosystem, Alpine uses musl and BusyBox, resulting in a much smaller base footprint. Additionally, by using the official Node image, we removed the need to manually install Node.js and its dependencies, eliminating extra layers and package manager overhead.</P>
        
        <P>Switching to <InlineCode>node:alpine</InlineCode> isn't just about saving disk space, it's about eliminating the 'digital clutter' that introduce security risks. By removing unnecessary binaries and libraries found in full distributions like Ubuntu, we shrink our attack surface and drastically reduce the number of high-severity vulnerabilities (CVEs) we have to monitor.</P>

        <P>Although switching to <Strong>Alpine</Strong> reduced the base image size, our image still contains everything required to build the application, including development dependencies and build tooling. In production, we only need the compiled output and runtime dependencies. <Strong>Multi-stage</Strong> builds allow us to separate the build environment from the final runtime image, keeping only what is strictly necessary.</P>

        <H3>Current Single-Stage Version (Before)</H3>
        <CodeBlock>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>node:24-alpine</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword><Syntax.Type> 3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type> ["node", "app.js"] </Syntax.Type></P>
        </CodeBlock>

        <P>The Problem:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- Entire source code remains</p>
          <p>- Potential dev tooling included</p>
          <p>- No strict separation of build vs runtime</p>
          <p>- If the app requires a build step (e.g., TypeScript, Prisma, bundlers), those tools remain in the final image</p>
        </div>

        <H3>Multi-Stage Version (After)</H3>
        <CodeBlock>
          <P><Syntax.Comment># ---------- Stage 1: Build ----------</Syntax.Comment></P>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>node:24-alpine </Syntax.Type><Syntax.Keyword>AS </Syntax.Keyword><Syntax.Type>builder</Syntax.Type></P>
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm run build</Syntax.Type></P>
          <br />
          <br />
          <P><Syntax.Comment># ---------- Stage 2: Production ----------</Syntax.Comment></P>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>node:24-alpine</Syntax.Type></P>
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci --omit=dev</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>--from=builder /usr/src/app/dist ./dist</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword><Syntax.Type> 3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type> ["node", "dist/app.js"] </Syntax.Type></P>
        </CodeBlock>

        <Img
          src="/blogs/dockerImagesAndOptimization/image_ver_5.png"
          alt="Docker image size version 5"
          className="max-w-2xl"
        />
        <Img
          src="/blogs/dockerImagesAndOptimization/history_version_5.png"
          alt="Docker history version 5"
          className="max-w-2xl"
        />

        <P>With multi-stage builds, the final production image contains only compiled JavaScript and runtime dependencies. Development tools such as TypeScript and testing libraries remain isolated in the builder stage and are completely discarded. This reduces the image size from 76MB to 59MB and significantly minimizes the attack surface, resulting in a cleaner and production-ready container.</P>

        <P>Although our image is now small and production-ready, it still runs as the root user by default. Running containers as root increases the impact of a potential compromise. As a final hardening step, we will run the application as a non-root user inside the container.</P>

        <P>Updated Dockerfile:</P>
        <CodeBlock>
          <P><Syntax.Comment># ---------- Stage 1: Builder ----------</Syntax.Comment></P>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>node:24-alpine </Syntax.Type><Syntax.Keyword>AS </Syntax.Keyword><Syntax.Type>builder</Syntax.Type></P>
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm run build</Syntax.Type></P>
          <br />
          <br />
          <P><Syntax.Comment># ---------- Stage 2: Production ----------</Syntax.Comment></P>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>node:24-alpine</Syntax.Type></P>
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci --omit=dev</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>--from=builder /usr/src/app/dist ./dist</Syntax.Type></P>
          <br />
          <P><Syntax.Comment># Use non-root user provided by base image</Syntax.Comment></P>
          <P><Syntax.Keyword>USER </Syntax.Keyword><Syntax.Type> node</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword><Syntax.Type> 3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type> ["node", "dist/app.js"] </Syntax.Type></P>
        </CodeBlock>

        <P>Even with Alpine, the image still contains a minimal Linux distribution, shell utilities, and package management tools. In production, our application only needs the Node runtime and compiled JavaScript files. Distroless images remove the operating system userland entirely, resulting in a smaller and more secure runtime environment.</P>

        <H3>Multi-Stage + Distroless Dockerfile</H3>
        <CodeBlock>
          <P><Syntax.Comment># ---------- Stage 1: Builder ----------</Syntax.Comment></P>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>node:24-alpine </Syntax.Type><Syntax.Keyword>AS </Syntax.Keyword><Syntax.Type>builder</Syntax.Type></P>
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm ci</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>. .</Syntax.Type></P>
          <P><Syntax.Keyword>RUN </Syntax.Keyword> <Syntax.Type>npm run build</Syntax.Type></P>
          <br />
          <br />
          <P><Syntax.Comment># ---------- Stage 2: Production (Distroless) ----------</Syntax.Comment></P>
          <P><Syntax.Keyword>FROM </Syntax.Keyword> <Syntax.Type>gcr.io/distroless/nodejs24-debian12</Syntax.Type></P>
          <P><Syntax.Keyword>WORKDIR </Syntax.Keyword> <Syntax.Type>/usr/src/app</Syntax.Type></P>
          <br />
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>package*.json ./</Syntax.Type></P>
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>--from=builder /usr/src/app/node_modules ./node_modules</Syntax.Type></P>
          <P><Syntax.Keyword>COPY </Syntax.Keyword> <Syntax.Type>--from=builder /usr/src/app/dist ./dist</Syntax.Type></P>
          <br />
          <P><Syntax.Comment># Distroless runs as non-root by default.</Syntax.Comment></P>
          <br />
          <P><Syntax.Keyword>EXPOSE </Syntax.Keyword><Syntax.Type> 3000</Syntax.Type></P>
          <P><Syntax.Keyword>CMD </Syntax.Keyword><Syntax.Type> ["dist/app.js"] </Syntax.Type></P>
        </CodeBlock>

        <P>Distroless images offer the ultimate security posture by removing everything except our application and its runtime dependencies, meaning there is no shell, package manager, or standard Unix utilities. While this drastically shrinks our attack surface and image size, the primary tradeoff is <Strong>debuggability</Strong>, since we cannot <InlineCode>docker exec</InlineCode> into a shell to inspect the file system or run network diagnostics, we must rely entirely on robust external logging and monitoring. Additionally, the build process becomes more complex because we must ensure every shared library and configuration file is explicitly copied over, as there is no underlying OS to provide them.</P>

        <P>Beforer closing off here are some points on what smaller image improves and what it does not:</P>
        <div className="space-y-2 mb-6 text-[15px] leading-relaxed">
          <p>- Faster Image Pull Time</p>
          <p>- Faster CI/CD Builds</p>
          <p>- Reduced Storage Costs</p>
          <p>- Smaller Attack Surface</p>
          <p>- Faster Deployment & Rollbacks</p>
          <p>- It does not affect application runtime performance</p>
          <p>- Does not affect memory usage at run time</p>
          <p>- Smaller does not make our app run faster</p>
        </div>

        <P>Docker image optimization primarily improves distribution efficiency, security posture, and operational scalability. It does not inherently optimize application logic or runtime performance.</P>

        <Divider />
        
        <H2>Conclusion</H2>
        <P>We started with a bloated Ubuntu-based image sitting at 637MB and worked our way down to a clean 238MB production container. Along the way, the actual application size dropped from 163MB to 59.2MB but, the bigger win was cutting nearly 400MB of stuff.</P>
        
        <P>More importantly, by systematically refining our layer structure, switching to a minimal <Strong>Alpine base</Strong>, and implementing <Strong>multi-stage builds</Strong> to prune development dependencies like TypeScript, we didn't just save space. We created a container that is faster to pull, cheaper to store, and significantly more secure by reducing the attack surface.</P>
        
        <P>Effective Docker optimization is not about a single trick, but about systematically refining layers, dependencies, base images, and runtime boundaries to produce a clean, production-grade artifact.</P>
        
        <P>Thank you for reading, and happy learning.</P>

      </article>
    </BlogLayout>
  );
}
