import { VscArrowLeft } from '@react-icons/all-files/vsc/VscArrowLeft';
import { VscArrowRight } from '@react-icons/all-files/vsc/VscArrowRight';
import { VscVersions } from '@react-icons/all-files/vsc/VscVersions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ServerRuntime } from 'next/types';
import { PACKAGES } from '~/util/constants';

export const runtime: ServerRuntime = 'edge';

async function getData(pkg: string) {
	if (!PACKAGES.includes(pkg)) {
		notFound();
	}

	const res = await fetch(`https://docs.discordjs.dev/api/info?package=${pkg}`, { next: { revalidate: 3_600 } });
	const data: string[] = await res.json();

	if (!data.length) {
		throw new Error('Failed to fetch data');
	}

	return data.reverse();
}

export default async function Page({ params }: { params: { package: string } }) {
	const data = await getData(params.package);

	return (
		<div className="min-w-xs sm:w-md mx-auto flex min-h-screen flex-col gap-8 px-4 py-6 lg:px-6 lg:py-6">
			<h1 className="text-2xl font-semibold">Select a version:</h1>
			<div className="flex flex-col gap-4">
				{data.map((version, idx) => (
					<Link
						className="dark:bg-dark-400 dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 focus:ring-width-2 focus:ring-blurple flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-col place-content-center rounded border border-neutral-300 bg-white p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 focus:ring active:translate-y-px active:bg-neutral-200 dark:text-white"
						href={`/docs/packages/${params.package}/${version}`}
						key={`${version}-${idx}`}
					>
						<div className="flex flex-row place-content-between place-items-center gap-4">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<VscVersions size={25} />
								<h2 className="font-semibold">{version}</h2>
							</div>
							<VscArrowRight size={20} />
						</div>
					</Link>
				)) ?? null}
			</div>
			<Link
				className="bg-blurple focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center gap-2 place-self-center rounded border-0 px-4 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
				href="/docs/packages"
			>
				<VscArrowLeft size={20} /> Go back
			</Link>
		</div>
	);
}
