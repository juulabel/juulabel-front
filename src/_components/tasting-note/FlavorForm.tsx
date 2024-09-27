interface IFlavorForm {
  handleStep: () => void;
}

export default function FlavorForm({ handleStep }: IFlavorForm) {
  return <div>This is flavor form.</div>;
}
