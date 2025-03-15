import SocialResponsibility from "./socialResponsibility";

export default function SocialSection() {
  return (
    <>
      <SocialResponsibility
        title="Responsabilidad Social"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, est?"
        points={[
          {
            title: "Lorem, ipsum dolor.",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          {
            title: "Lorem, ipsum dolor.",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          {
            title: "Lorem, ipsum dolor.",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
        ]}
        imageSrc="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80&h=768"
        imagePosition="right"
      />

      <hr className="mx-auto my-2 w-5/6 border-t border-white bg-transparent" />

      <SocialResponsibility
        title="Responsabilidad Social"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, est?"
        points={[
          {
            title: "Lorem, ipsum dolor.",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          {
            title: "Lorem, ipsum dolor.",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          {
            title: "Lorem, ipsum dolor.",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
        ]}
        imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80&h=768"
        imagePosition="left"
      />
    </>
  );
}
