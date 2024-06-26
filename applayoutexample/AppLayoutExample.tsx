import React from "react"
import { AppLayout } from "@linked-planet/ui-kit-ts"

import "@atlaskit/css-reset" // sets base styles of AK

export default function AppLayoutExample() {
	return (
		<AppLayout.Container>
			<AppLayout.Banner
				sticky
				//height={"3rem"}
				className="border-2 border-solid px-4 py-2"
			>
				Sticky Banner
			</AppLayout.Banner>
			<AppLayout.TopNavigation
				sticky
				className="border-2 border-solid p-4"
			>
				Sticky Top Navigation
			</AppLayout.TopNavigation>
			<AppLayout.LeftPanel sticky className="border-2 border-dashed p-4">
				<h1>Left Panel</h1>
				<br />
				<p>This panel is sticky.</p>
				<hr />
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Enim hic, quos deleniti vitae, harum soluta excepturi
					voluptate non ducimus nemo dignissimos quam obcaecati culpa?
					Quidem non veniam accusantium blanditiis consequatur? Lorem
					ipsum dolor sit amet consectetur adipisicing elit. Dolore
					qui suscipit dignissimos. Perferendis soluta dolore nostrum?
					Nulla officia possimus autem. Dolor ipsa eaque, ipsam eum
					beatae libero nam repellendus voluptatibus? Lorem ipsum
					dolor, sit amet consectetur adipisicing elit. Asperiores,
					ipsa? Suscipit maiores quis adipisci nam, hic recusandae
					corrupti aliquid dignissimos ipsam tenetur, dicta eos, eaque
					necessitatibus molestias sint commodi ipsum.
				</p>
			</AppLayout.LeftPanel>
			<AppLayout.RightPanel className="border-2 border-dashed p-4">
				<h1>Right Panel</h1>
				<br />
				<p>This panel is not sticky.</p>
				<hr />
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit.
					Ducimus earum ad similique ipsam! Praesentium sint
					voluptatibus porro recusandae pariatur minus quasi magni,
					perferendis ad ab! Quasi molestias dolorem ipsam
					perferendis? Lorem ipsum, dolor sit amet consectetur
					adipisicing elit. Nesciunt facere aut totam nobis autem amet
					nulla, facilis tenetur ipsam, nam vero laboriosam maiores,
					dolores in laudantium fuga labore veritatis sequi. Lorem
					ipsum dolor sit amet consectetur adipisicing elit. Veritatis
					dolor pariatur exercitationem officia repellat at in, aut
					quos quod, molestiae quia quis dolores impedit dignissimos,
					odit maxime deserunt consequatur numquam?
				</p>
			</AppLayout.RightPanel>
			<AppLayout.Content>
				<AppLayout.LeftSidebar sticky>
					<h1>Left Sidebar</h1>
				</AppLayout.LeftSidebar>
				<AppLayout.Main>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Unde non ad, sint, neque modi labore quibusdam nisi ratione
					quam culpa necessitatibus placeat facere repellat libero
					molestias? Enim id quibusdam ratione. Lorem ipsum dolor sit
					amet consectetur adipisicing elit. Esse neque omnis ex
					cupiditate repellat, quia aliquid quod. Iste corporis
					eveniet ad! Dolorem, maxime incidunt eius nemo enim esse
					optio cum. Lorem, ipsum dolor sit amet consectetur
					adipisicing elit. Inventore modi iure deleniti maiores
					pariatur, nobis ratione, necessitatibus repellat doloribus
					error atque aspernatur dolor porro nihil consequatur quasi.
					Nam, veniam ullam. Lorem, ipsum dolor sit amet consectetur
					adipisicing elit. Quibusdam odio laboriosam assumenda
					perspiciatis earum, ad, quam voluptatem asperiores possimus
					ratione beatae vel in tenetur quaerat temporibus accusamus
					cum a iusto.
				</AppLayout.Main>
			</AppLayout.Content>
		</AppLayout.Container>
	)
}
