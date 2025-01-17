<?php
require_once('../config.php');
require_once(HEADER_TEMPLATE);
//
?>

<center>
	<div class="card border-secondary text-center mb-3" style="max-width: 32rem;">
		<div class="card-header text-white bg-secondary font-weight-bold text-center">My Whats</div>
		<div class="card-body text-secondary text-center align-items-center">
			<div class="row d-flex justify-content-center">
				<div class="col-md-6 text-center">
					<span id="qrcodeVenon"></span>
				</div>
				<div class="col-md-6 text-left">
					<strong>Serviço.........: </strong><span id="statusVenon"></span>
					<br>
					<strong>Status...........: </strong><span id="startVenom"></span>
					<br>
					<strong>Contato.......: </strong><span id="contatoVenon"></span>
					<br>
					<strong>Wa Versão...: </strong><span id="waversaoVenon"></span>
					<br>
					<strong>Plataforma..: </strong><span id="sistemaVenon"></span>
					<br>
					<strong>Bateria.........: </strong><span id="bateriaVenon"></span>
					<br>
					<strong>Carregador..: </strong><span id="carregadorVenon"></span>
				</div>
			</div>
		</div>
		<div class="card-footer text-muted text-center">
			<div class="row d-flex justify-content-center">
				<div class="col-md-4 text-center">
					<button id="starVenon" type="button" class="btn btn-sm btn-success">Iniciar</button>
				</div>
				<div class="col-md-4 text-center">
					<button id="restarVenon" type="button" class="btn btn-sm btn-warning">Reiniciar</button>
				</div>
				<div class="col-md-4 text-center">
					<button id="desconectarVenon" type="button" class="btn btn-sm btn-danger">Desconectar</button>
				</div>
			</div>
		</div>
	</div>
</center>
<div class="row d-flex justify-content-center">
	<div class="col-sm-10">
		<form class="text-center" id="checkNumberStatusMassa-form" method="post" enctype="multipart/form-data" action="javascript:void(0)">
			<div class="card border-success mb-3">
				<div class="card-header text-white bg-success font-weight-bold text-center">Checar Número / Contato em massa</div>
				<div class="card-body text-success text-center ">
					<div class="col-md-12 text-center">
						<div class="form-group col-12 text-center">
							<div class="input-group">
								<div class="input-group-prepend">
									<div class="input-group-text">
										<i class="fas fa-user-secret"></i>
									</div>
								</div>
								<input type="text" class="rounded form-control text-center" name="SessionName" id="SessionName" value="BotClient" readonly="true" />
							</div>
						</div>
					</div>
					<div class="form-group col-12">
						<div class="input-group">
							<div class="input-group-prepend">
								<div class="input-group-text">
									<i class="fas fa-phone"></i>
								</div>
							</div>
							<div class="custom-file">
								<input type="file" class="rounded form-control" name="checkNumberStatusMassaContato" id="checkNumberStatusMassaContato" />
								<label class="custom-file-label" for="checkNumberStatusMassaContato" id="checkNumberStatusMassaContato-label">Selecione o arquivo de contatos...</label>
							</div>
							<br>
							<input type="hidden" name="filecheckNumberStatusMassaContato" id="filecheckNumberStatusMassaContato" />
						</div>
						<span class="help-block r" id="error"></span>
					</div>
				</div>
				<div class="card-footer text-muted text-center">
					<button type="submit" name="checkNumberStatusMassa" id="checkNumberStatusMassa" class="btn btn-sm btn-primary"><i class="fas fa-paper-plane"></i> Checar</button>
				</div>
			</div>
		</form>
	</div>
</div>
<!-- Modal -->
<div class="modal fade" id="checkNumberStatusMassaModalCentralizado" tabindex="-1" role="dialog" aria-labelledby="TituloModalCentralizado" data-keyboard="false" data-backdrop="static" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header bg-success">
				<h5 class="modal-title" id="TituloModalCentralizado">Resumo das validações</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<legend>Success</legend>
				<table class="table table-striped table-hover">
					<thead class="thead-dark">
						<tr>
							<th scope="col">Numero</th>
							<th scope="col">Status</th>
						</tr>
					</thead>
					<tbody id='table_success'></tbody>
				</table>
				<br>
				<legend>Erros</legend>
				<table class="table table-striped table-hover">
					<thead class="thead-dark">
						<tr>
							<th scope="col">Numero</th>
							<th scope="col">Status</th>
						</tr>
					</thead>
					<tbody id='table_error'></tbody>
				</table>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
			</div>
		</div>
	</div>
</div>

<?php
include_once(FOOTER_TEMPLATE);
?>