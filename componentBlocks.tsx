import React from "react";
import {
  component,
  fields,
  NotEditable,
} from "@keystone-next/fields-document/component-blocks";

// naming the export componentBlocks is important because the Admin UI
// expects to find the components like on the componentBlocks export
export const componentBlocks = {
  // imageUrl: component({
  //   component: ({ url, description }) => {
  //     const strUrl = String(url);
  //     const strDescription = String(description);
  //     return (
  //       // <div>
  //       <img src={strUrl} alt={strDescription} />
  //       // </div>
  //     );
  //   },
  //   label: "Image",
  //   props: {
  //     url: fields.text({
  //       label: "URL",
  //       defaultValue: ""
  //     }),
  //     description: fields.text({
  //       label: "Description",
  //       defaultValue: ""
  //     })
  //   },
  //   chromeless: true
  // })
  cloudinaryImage: component({
    component: ({ image }) => {
      const data = image?.value?.data;
      if (!image.value) return <NotEditable>No Image Selected</NotEditable>;
      console.log(image);
      return (
        <NotEditable>
          <img
            src={data?.image?.publicUrlTransformed}
            alt={data?.description}
            style={{ width: "100%" }}
          />
        </NotEditable>
      );
    },
    label: "Image",
    props: {
      image: fields.relationship<"one">({
        label: "Image",
        relationship: "image",
      }),
    },
  }),
};

// const hi = {
//   id: "ckvsvnxab00000amx5uycayep",
//   _meta: {
//     url: "http://res.cloudinary.com/dhqfl5nxi/image/upload/v1636509773/ckvsvnxab00000amx5uycayep.jpg",
//     etag: "b009b15b6a9c56e0548249f4c0f0b2ff",
//     tags: [],
//     type: "upload",
//     bytes: 438292,
//     width: 2256,
//     format: "jpg",
//     height: 4032,
//     api_key: "989889758565518",
//     version: 1636509773,
//     asset_id: "777790584dcfae07de0d752fc82b353b",
//     public_id: "ckvsvnxab00000amx5uycayep",
//     signature: "4d8348d6a1a5273c36380e64454603c52f013c28",
//     created_at: "2021-11-10T02:02:53Z",
//     secure_url:
//       "https://res.cloudinary.com/dhqfl5nxi/image/upload/v1636509773/ckvsvnxab00000amx5uycayep.jpg",
//     version_id: "ed870cde5d3fc6ed9e8b137b1b065a26",
//     placeholder: false,
//     resource_type: "image",
//     original_filename: "file"
//   },
//   encoding: "7bit",
//   filename: "meri_radish.jpg",
//   mimetype: "image/jpeg",
//   originalFilename: "meri_radish.jpg"
// };
