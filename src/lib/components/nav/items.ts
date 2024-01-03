declare type NavbarItem = {
	title: string;
	href?: string;
	items?: NavbarItem[];
};

export const navEntries: NavbarItem[] = [
	{
		title: "Test",
		items: [
			{
				title: "Link",
				href: "/",
			},
		],
	},
];
