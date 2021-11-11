import { list, graphql } from "@keystone-next/keystone";
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  virtual,
} from "@keystone-next/keystone/fields";
import { document } from "@keystone-next/fields-document";
import { Node } from "slate";
import { deployFrontend } from "./lib/deploy";
import { componentBlocks } from "./componentBlocks";
// import { S3ImagesConfig, s3Images } from "@k6-contrib/fields-s3-images";
import "dotenv/config";
import { cloudinaryImage } from "@keystone-next/cloudinary";

// const s3Config: S3ImagesConfig = {
//   bucket: process.env.S3_BUCKET || "", // name of bucket
//   folder: process.env.S3_PATH,
//   baseUrl: process.env.S3_BASE_URL, // if provided the url is not compouted from endpoint and folder, rather use this as `${baseUrl}/${filename}`
//   s3Options: {
//     accessKeyId: process.env.S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     endpoint: process.env.S3_ENDPOINT, // use region for aws, endpoint for s3 compatible storage
//   },
//   sizes: {
//     sm: 360,
//     md: 720,
//     lg: 1280,
//   },
//   uploadParams() {
//     return {
//       ACL: "public-read", // needed to make it public
//     };
//   },
// };

export function defaultSlug({ context, inputData }: any) {
  const date = new Date();
  return `${
    inputData?.title
      ?.trim()
      ?.toLowerCase()
      ?.replace(/[^\w ]+/g, "")
      ?.replace(/ +/g, "-") ?? ""
  }-${date?.getFullYear() ?? ""}${date?.getMonth() + 1 ?? ""}${
    date?.getDate() ?? ""
  }`;
}

const serialise = (nodes: Node[]) => {
  const stringText = nodes.map((n) => Node.string(n)).join("\n");
  return stringText;
};

export const lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
      posts: relationship({ ref: "Post.author", many: true }),
    },
    ui: {
      listView: {
        initialColumns: ["name", "posts"],
      },
    },
  }),
  Post: list({
    fields: {
      title: text(),
      slug: text({
        ui: { createView: { fieldMode: "hidden" } },
        isIndexed: "unique",
        hooks: {
          resolveInput: ({ operation, resolvedData, inputData, context }) => {
            if (operation === "create" && !inputData.slug) {
              return defaultSlug({ context, inputData });
            }
            return resolvedData.slug;
          },
        },
      }),
      status: select({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ],
        defaultValue: "draft",
        ui: {
          displayMode: "segmented-control",
        },
      }),
      content: document({
        ui: {
          views: require.resolve("./componentBlocks"),
        },
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        relationships: {
          image: {
            kind: "prop",
            listKey: "Image",
            selection: "id description image { publicUrlTransformed }",
          },
        },
        componentBlocks,
      }),
      publishDate: timestamp(),
      author: relationship({
        ref: "User.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email"] },
        },
      }),
      tags: relationship({
        ref: "Tag.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
        many: true,
      }),
      plaintext: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item, args, context) {
            const { content } = await context.query.Post.findOne({
              where: { id: item.id.toString() },
              query: "content { document }",
            });
            return serialise(content.document);
          },
        }),
      }),
      // image: s3Images({ s3Config })
    },
    hooks: {
      afterOperation: () => {
        deployFrontend();
      },
    },
  }),
  Tag: list({
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: "Post.tags", many: true }),
    },
  }),
  Image: list({
    fields: {
      image: cloudinaryImage({
        cloudinary: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
          apiKey: process.env.CLOUDINARY_API_KEY || "",
          apiSecret: process.env.CLOUDINARY_API_SECRET || "",
          folder: process.env.CLOUDINARY_API_FOLDER,
        },
      }),
      description: text(),
    },
  }),
  ui: {
    labelField: "description",
  },
};
